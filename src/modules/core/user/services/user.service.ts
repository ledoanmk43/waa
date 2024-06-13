import { BaseService } from '@common/base'
import { ILogger } from '@infra/logger/interface'
import { LOGGER_KEY } from '@infra/logger/logger.constant'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { UserRepository } from '../repositories/user.repository'
import { User } from '../entities'
// import * as bcrypt from 'bcrypt'
import { EUserMessage } from '@common/enums'
import { SignUpDto } from '@core/auth/dtos'
import { FindOneOptions } from 'typeorm'

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @Inject(LOGGER_KEY) private logger: ILogger,
    private readonly repository: UserRepository
  ) {
    super(repository)
  }
  async addUser(userDto: SignUpDto): Promise<User> {
    try {
      const newUser = this.repository.create(userDto)
      const user = await this.repository.save(newUser)

      return user
    } catch (error) {
      this.logger.error(error.message)
      if (error.message.includes('duplicate key')) {
        throw new HttpException(EUserMessage.ALREADY_EXISTS_EMAIL, HttpStatus.CONFLICT)
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async searchUserByCondition(condition: FindOneOptions<User>): Promise<User> {
    try {
      const user = await this.repository.findOne(condition)
      return user
    } catch (error) {
      this.logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }

  async searchUserById(id: string): Promise<User> {
    try {
      const user = await this.repository.findOne({ where: { id } })
      return user
    } catch (error) {
      this.logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }

  // async updateUserStatusByEmail(activateDto: ActivateDto): Promise<void> {
  //   try {
  //     const user = await this.searchUserByCondition({
  //       where: { email: activateDto.email }
  //     })
  //     if (user) {
  //       await this.repository
  //         .createQueryBuilder()
  //         .update(User)
  //         .set({
  //           isDisable: !user.isDisable,
  //           isPending: !user.isPending
  //         })
  //         .where('id = :id', { id: user.id })
  //         .execute()
  //     } else {
  //       throw new Error('user not found')
  //     }
  //   } catch (error) {
  //     this.logger.error(error.message)
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
  //   }
  // }

  // async updateUserPwByEmail(userEmail: string, temporaryPw: string): Promise<User> {
  //   try {
  //     const user = await this.searchUserByCondition({
  //       where: { email: userEmail }
  //     })
  //     if (user) {
  //       temporaryPw = bcrypt.hashSync(temporaryPw, bcrypt.genSaltSync())
  //       await this.repository
  //         .createQueryBuilder()
  //         .update(User)
  //         .set({
  //           password: temporaryPw
  //         })
  //         .where('id = :id', { id: user.id })
  //         .execute()
  //       return user
  //     } else {
  //       throw new Error('This email does not exist')
  //     }
  //   } catch (error) {
  //     this.logger.error(error.message)
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
  //   }
  // }

  // async resetPw(resetPwDto: ResetPwDto): Promise<void> {
  //   try {
  //     const user = await this.searchUserByCondition({
  //       where: { email: resetPwDto.email }
  //     })
  //     // Verify password
  //     if (user) {
  //       //check current password from dto and user in db
  //       const isVerified = await bcrypt.compare(resetPwDto.currentPassword, user.password)
  //       if (isVerified) {
  //         // hash password from dto
  //         const newPw = bcrypt.hashSync(resetPwDto.newPassword, bcrypt.genSaltSync())
  //         // and then save new password
  //         await this.repository
  //           .createQueryBuilder()
  //           .update(User)
  //           .set({
  //             password: newPw
  //           })
  //           .where('id = :id', { id: user.id })
  //           .execute()
  //       } else {
  //         throw new Error('wrong current password')
  //       }
  //     } else {
  //       throw new Error('user not found')
  //     }
  //   } catch (error) {
  //     this.logger.error(error.message)
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
  //   }
  // }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.repository.find({
        order: {
          createdDate: 'ASC'
        }
      })

      if (!users.length) {
        throw new Error(EUserMessage.NOT_FOUND)
      }

      return users
    } catch (error) {
      this.logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }
}
