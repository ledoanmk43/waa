import { User } from '@core/user/entities'
import { UserService, RoleService } from '@core/user/services'
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AuthResponseDto, SignInDto, SignUpDto } from './dtos'
import { TBlacklistService, TJwtPayload } from './types'
import { ECommonMessage, ETimeUnit, EUserMessage } from '@common/enums'
import { CacheService } from '@infra/cache/cache.service'
import { ConfigService } from '@infra/config/config.service'
import { BlacklistRefreshToken } from './entities'
import { AuthRepository } from './auth.repository'
import { BaseService } from '@common/base'

@Injectable()
export class AuthService extends BaseService<BlacklistRefreshToken> {
  constructor(
    private readonly _cacheService: CacheService,
    private readonly _userService: UserService,
    private readonly _roleService: RoleService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _repository: AuthRepository
  ) {
    super(_repository)
  }

  private accessTokenSecret = this._configService.get<string>('AC_JWT_SECRET')
  private refreshTokenSecret = this._configService.get<string>('RF_JWT_SECRET')

  //   async googleLogin(userDto: OAuthUser): Promise<AuthResponseDto> {
  //     const defaultPassword: string = generateRandomPassword()
  //     try {
  //       const user = await this.userService.searchUserByCondition({
  //         where: { email: userDto.email },
  //         relations: ['roles']
  //       })

  //       if (user) {
  //         // When this email exists in system
  //         const roleIdList = user.roles.map((role) => {
  //           return role.id
  //         })
  //         // Return JWT if success
  //         return this.generateAccessToken(user, roleIdList)
  //       } else {
  //         // When this email first time registers to the system
  //         const newUserDto: RegisterDTO = {
  //           firstName: userDto.firstName,
  //           lastName: userDto.lastName,
  //           email: userDto.email,
  //           password: defaultPassword,
  //           role: null
  //         }
  //         // Create new user
  //         const user = await this.userService.addUser(newUserDto)
  //         // Get role
  //         const role = await this.roleService.searchRoleByCondition({
  //           where: { name: 'USER' },
  //           relations: ['users']
  //         })
  //         role.users.push(user)
  //         //Insert to junction table
  //         const savedRole = await this.roleService.addRole(role)
  //         // Send mail notification user about new password
  //         if (user) {
  //           const idToken = getRandomToken()

  //           const mailingParams = new SendChangePwMailRequest(
  //             idToken,
  //             defaultPassword,
  //             user.firstName,
  //             user.email,
  //             process.env.AUTH_RESET_PASSWORD_URL
  //           )
  //           const mailingResponse = await new Promise<boolean>((resolve) => {
  //             this.mailingClient
  //               .emit(GET_MAILING_ON_SIGNUP_RESPONSE_TOPIC, JSON.stringify(mailingParams))
  //               .subscribe((data) => {
  //                 if (data) {
  //                   resolve(true)
  //                 } else {
  //                   resolve(false)
  //                 }
  //               })
  //           })
  //           if (mailingResponse) {
  //             await this.cacheManager.set(
  //               idToken,
  //               REDIS_CHANGE_PW_SESSION,
  //               Number(process.env.REDIS_NEW_PW_MAIL_EXPIRE_TIME)
  //             ) // expire in 1 day
  //             // return this.generateAccessToken(user, [savedRole.id]);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       Logger.error(error.message)
  //       throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
  //     }
  //   }

  // Register new user
  async signUpUser(userDto: SignUpDto): Promise<AuthResponseDto> {
    try {
      // Create new user
      const user = await this._userService.addUser(userDto)

      // Get role
      const role = await this._roleService.searchRoleByCondition({
        where: { name: 'USER' },
        relations: ['users']
      })
      role.users.push(user)

      //Insert to junction table
      const savedRole = await this._roleService.addRole(role)

      // Return JWT access + refresh tokens when succeed
      return {
        accessToken: this.generateJwtAccessToken(user, [savedRole.id]),
        refreshToken: this.generateJwtRefreshToken(user, [savedRole.id])
      }
    } catch (error) {
      Logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // Authenticate user
  async signInUser(userDto: SignInDto): Promise<AuthResponseDto> {
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

      const roleIdList = user.roles.map((role) => {
        return role.id
      })

      // Return JWT access + refresh tokens when succeed
      return {
        accessToken: this.generateJwtAccessToken(user, roleIdList),
        refreshToken: this.generateJwtRefreshToken(user, roleIdList)
      }
    } catch (error) {
      Logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // Refresh token
  async refreshToken({ id, email }: TJwtPayload): Promise<AuthResponseDto> {
    try {
      const user = await this._userService.searchUserByCondition({
        where: { id, email },
        relations: ['roles']
      })

      if (!user) {
        throw new Error(EUserMessage.WRONG_USERNAME)
      }

      const roleIdList = user.roles.map((role) => {
        return role.id
      })

      // Return new JWT access + refresh tokens when succeed
      return {
        accessToken: this.generateJwtAccessToken(user, roleIdList),
        refreshToken: this.generateJwtRefreshToken(user, roleIdList)
      }
    } catch (error) {
      Logger.error(error.message)
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
      Logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async checkIsValidSessionToken(tokenId: string): Promise<boolean> {
    const redisData = await this._cacheService.get(tokenId)
    return !!redisData
  }

  generateJwtAccessToken(user: User, roleIdList: string[]): string {
    const payload: TJwtPayload = {
      id: user.id,
      email: user.email,
      roleIds: roleIdList
    }

    const jwtOptions: JwtSignOptions = {
      secret: this.accessTokenSecret,
      expiresIn: ETimeUnit.QUARTER_HOUR_IN_SECONDS
    }

    return this._jwtService.sign(payload, jwtOptions)
  }

  generateJwtRefreshToken(user: User, roleIdList: string[]): string {
    const payload: TJwtPayload = {
      id: user.id,
      email: user.email,
      roleIds: roleIdList
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
      throw new HttpException(ECommonMessage.TOKEN_EXPIRED, HttpStatus.BAD_REQUEST)
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
