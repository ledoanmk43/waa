import { User } from '@core/user/entities'
import { UserService, RoleService } from '@core/user/services'
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AuthResponse, SignInDto, SignUpDto } from './dtos'
import { TJwt_Secret, TBlacklistService, TJwtPayload, TOAuthPayload } from './types'
import { ECommonErrorMessage, ETimeUnit, EUserMessage } from '@common/enums'
import { CacheService } from '@infra/cache/cache.service'
import { ConfigService } from '@infra/config/config.service'
import { BlacklistRefreshToken } from './entities'
import { AuthRepository } from './auth.repository'
import { BaseService } from '@common/base'
import { ILogger } from '@infra/logger/interface'
import { LOGGER_KEY } from '@infra/logger/logger.constant'

@Injectable()
export class AuthService extends BaseService<BlacklistRefreshToken> {
  constructor(
    @Inject(LOGGER_KEY) private _logger: ILogger,
    private readonly _cacheService: CacheService,
    private readonly _userService: UserService,
    private readonly _roleService: RoleService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _repository: AuthRepository
  ) {
    super(_repository)
  }

  private accessTokenSecret = this._configService.get<TJwt_Secret>('AC_JWT_SECRET')
  private refreshTokenSecret = this._configService.get<TJwt_Secret>('RF_JWT_SECRET')

  async googleLogin(payload: TOAuthPayload): Promise<AuthResponse> {
    try {
      let targetUser: User
      targetUser = await this._userService.searchUserByCondition({
        where: { email: payload.email },
        relations: ['roles']
      })

      if (!targetUser) {
        // When this email first time registers to the system
        const userDto: SignUpDto = {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: this.generateRandomPassword() // Generate random password
        }

        //Create new user and Insert to junction table
        targetUser = await this.createAndAssignRoleToUser(userDto)
      }

      // Return JWT access + refresh tokens when succeed
      return {
        accessToken: this.generateJwtAccessToken(targetUser),
        refreshToken: this.generateJwtRefreshToken(targetUser)
      }
    } catch (error) {
      this._logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // Register new user
  async signUpUser(userDto: SignUpDto): Promise<AuthResponse> {
    try {
      //Create new user and Insert to junction table
      const user = await this.createAndAssignRoleToUser(userDto)

      // Return JWT access + refresh tokens when succeed
      return {
        accessToken: this.generateJwtAccessToken(user),
        refreshToken: this.generateJwtRefreshToken(user)
      }
    } catch (error) {
      this._logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // Authenticate user
  async signInUser(userDto: SignInDto): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await this._userService.searchUserByCondition({
        where: { email: userDto.email },
        relations: ['roles']
      })

      if (!user) {
        throw new Error(EUserMessage.WRONG_USERNAME)
      }

      // Verify password
      const isVerified = await bcrypt.compare(userDto.password, user.password)
      if (!isVerified) {
        throw new BadRequestException(EUserMessage.WRONG_PASSWORD)
      }

      // Return JWT access + refresh tokens when succeed
      return {
        accessToken: this.generateJwtAccessToken(user),
        refreshToken: this.generateJwtRefreshToken(user)
      }
    } catch (error) {
      this._logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // Refresh token
  async refreshToken({ id, email, refreshToken }: TJwtPayload): Promise<AuthResponse> {
    try {
      const user = await this._userService.searchUserByCondition({
        where: { id, email },
        relations: ['roles']
      })

      if (!user) {
        throw new Error(EUserMessage.WRONG_USERNAME)
      }

      // Return new JWT access + refresh tokens when succeed
      return {
        accessToken: this.generateJwtAccessToken(user),
        refreshToken
      }
    } catch (error) {
      this._logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // Sign out user
  async signOutUser(accessToken: string, refreshToken: string) {
    try {
      // Verify and blacklist access token
      await this.verifyAndBlacklistToken(accessToken, this.accessTokenSecret, 'redis')

      // Verify and blacklist refresh token
      await this.verifyAndBlacklistToken(refreshToken, this.refreshTokenSecret, 'postgres')
    } catch (error) {
      this._logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async checkIsValidSessionToken(tokenId: string): Promise<boolean> {
    const redisData = await this._cacheService.get(tokenId)
    return !!redisData
  }

  generateJwtAccessToken(user: User): string {
    const payload: TJwtPayload = {
      id: user.id,
      email: user.email,
      roleIds: user.roles.map((role) => role.id)
    }

    const jwtOptions: JwtSignOptions = {
      secret: this.accessTokenSecret,
      expiresIn: ETimeUnit.QUARTER_HOUR_IN_SECONDS
    }

    return this._jwtService.sign(payload, jwtOptions)
  }

  generateJwtRefreshToken(user: User): string {
    const payload: TJwtPayload = {
      id: user.id,
      email: user.email,
      roleIds: user.roles.map((role) => role.id)
    }

    const jwtOptions: JwtSignOptions = {
      secret: this.refreshTokenSecret,
      expiresIn: ETimeUnit.WEEK_HOUR_IN_SECONDS
    }

    return this._jwtService.sign(payload, jwtOptions)
  }

  // Helper function to verify token and handle token blacklisting
  async verifyAndBlacklistToken(token: string, secret: string, type: TBlacklistService) {
    const payload: TJwtPayload = this._jwtService.verify(token, { secret })
    const { id, exp } = payload
    const currentTime = Math.floor(Date.now() / ETimeUnit.SECOND_IN_MILLISECONDS)
    const ttl: number = (exp - currentTime) * ETimeUnit.SECOND_IN_MILLISECONDS

    if (ttl > 0) {
      if (type === 'postgres') {
        // Add refresh token to blacklist in postgres
        const refreshTokenEntity = this._repository.create({
          token,
          expireDate: new Date(exp * ETimeUnit.SECOND_IN_MILLISECONDS)
        })

        await this._repository.save(refreshTokenEntity)
      } else {
        // Add access token to blacklist in redis
        await this._cacheService.set(token, id, ttl)
      }
    } else {
      throw new HttpException(ECommonErrorMessage.TOKEN_EXPIRED, HttpStatus.BAD_REQUEST)
    }
  }

  async createAndAssignRoleToUser(userDto: SignUpDto) {
    try {
      // Get role
      const role = await this._roleService.searchRoleByCondition({
        where: { name: 'USER' }
      })
      // Assign role(s) to user
      userDto.roles = [role]

      // Create new user
      const user = await this._userService.addUser(userDto)
      // Attach role to user
      user.roles = [role]

      return user
    } catch (error) {
      this._logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  private generateRandomPassword(): string {
    const passwordLength = 8 // You can adjust the desired password length here
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const digitChars = '0123456789'
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

    const allChars = lowercaseChars + uppercaseChars + digitChars + specialChars

    let randomPassword = ''
    for (let i = 0; i < passwordLength + 1; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length)
      randomPassword += allChars[randomIndex]
    }

    return randomPassword + Math.floor(Math.random() * 10)
  }

  private getRandomToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    )
  }
}
