import { BaseService } from '@common/base'
import { ETimeUnit, EUserError } from '@common/enums'
import { getRandomToken } from '@common/helpers'
import { SignUpDto } from '@core/auth/dtos'
import { CacheService } from '@infra/cache/cache.service'
import { ConfigService } from '@infra/config/config.service'
import { ILogger } from '@infra/logger/interface'
import { LOGGER_KEY } from '@infra/logger/logger.constant'
import { TMailPayload } from '@infra/mailer/mailer-option.type'
import { GMAIL_SERVICE } from '@infra/mailer/mailer.constant'
import MailService from '@infra/mailer/mailer.service'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { FindOneOptions } from 'typeorm'
import { ForgotPasswordDto } from '../dtos'
import { User } from '../entities'
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @Inject(LOGGER_KEY) private _logger: ILogger,
    private readonly _repository: UserRepository,

    @Inject(GMAIL_SERVICE)
    private readonly _mailService: MailService,
    private readonly _cacheService: CacheService,
    private readonly _configService: ConfigService
  ) {
    super(_repository)
  }

  async addUser(userDto: SignUpDto): Promise<User> {
    try {
      const newUser = this._repository.create(userDto)

      const user = await this._repository.save(newUser)

      return user
    } catch (error) {
      this._logger.error(error.message)
      if (error.message.includes('duplicate key')) {
        throw new HttpException(EUserError.ALREADY_EXISTS_EMAIL, HttpStatus.CONFLICT)
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async searchUserByCondition(condition: FindOneOptions<User>): Promise<User> {
    try {
      const user = await this._repository.findOne(condition)

      return user
    } catch (error) {
      this._logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }

  async searchUserById(id: string): Promise<User> {
    try {
      const user = await this._repository.findOne({ where: { id } })
      return user
    } catch (error) {
      this._logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }

  async sendEmailResetUserPassword({ email }: ForgotPasswordDto): Promise<void> {
    try {
      const user = await this._repository.findOne({ where: { email } })
      if (!user) {
        throw new Error(EUserError.NOT_FOUND)
      }
      const sessionToken = getRandomToken()
      const payload: TMailPayload = {
        to: email,
        subject: '[Reset Password] Reset your password',
        template: 'forgot-password',
        context: {
          expireTime: '15 minutes',
          name: user.firstName,
          link:
            this._configService.get<string>('AUTH_RESET_PASSWORD_URL') +
            email +
            '&session=' +
            getRandomToken()
        }
      }

      await this._mailService.sendMail(payload)
      this._cacheService.set(sessionToken, email, ETimeUnit.QUARTER_HOUR_IN_SECONDS)
    } catch (error) {
      this._logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this._repository.find({
        order: {
          createdDate: 'ASC'
        }
      })

      if (!users.length) {
        throw new Error(EUserError.NOT_FOUND)
      }

      return users
    } catch (error) {
      this._logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }
}
