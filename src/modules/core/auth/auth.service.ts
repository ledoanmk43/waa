// import { OAuthUser } from '@common/common.types'
import { User } from '@core/user/entities'
import { UserService, RoleService } from '@core/user/services'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Cache } from 'cache-manager'
import { AuthResponseDto, SignInDto, SignUpDto } from './dtos'
import { IJwtPayload } from './strategies'
import { EUserMessage } from '@common/enums'

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService
  ) {}

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

  async registerUser(userDto: SignUpDto): Promise<AuthResponseDto> {
    try {
      // Create new user
      const user = await this.userService.addUser(userDto)
      // Get role
      const role = await this.roleService.searchRoleByCondition({
        where: { name: 'USER' },
        relations: ['users']
      })
      role.users.push(user)
      //Insert to junction table
      const savedRole = await this.roleService.addRole(role)
      // Return JWT if success
      return this.generateAccessToken(user, [savedRole.id])
    } catch (error) {
      Logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // Authenticate user
  async loginUser(userDto: SignInDto): Promise<AuthResponseDto> {
    try {
      // Find user by email
      const user = await this.userService.searchUserByCondition({
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

      // Return JWT when succeed
      return this.generateAccessToken(user, roleIdList)
    } catch (error) {
      Logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  generateAccessToken(user: User, roleIdList: string[]): AuthResponseDto {
    const response = new AuthResponseDto()
    response.accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
      roleIds: roleIdList
    } as IJwtPayload)
    return response
  }

  async checkIsValidSessionToken(idToken: string): Promise<boolean> {
    const redisData = await this.cacheManager.get(idToken)
    if (redisData) {
      return true
    } else {
      return false
    }
  }

  async addAccessTokenBlackList(accessToken: string, userId: string) {
    try {
      const payloadFromToken: any = this.jwtService.verify(accessToken)
      const currentTime = Math.floor(Date.now() / 1000)
      const ttl: number = (payloadFromToken.exp - currentTime) * 1000 // the remaining time of the token is also the time it will be in blacklist
      if (ttl > 0) {
        await this.cacheManager.set(accessToken, userId, ttl)
      } else {
        throw new HttpException('Token has expired', HttpStatus.BAD_REQUEST)
      }
    } catch (error) {
      Logger.error(error.message)
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
