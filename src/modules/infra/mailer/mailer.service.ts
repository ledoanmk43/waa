import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ILogger } from '@infra/logger/interface'

import { LOGGER_KEY } from '@infra/logger/logger.constant'
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'

@Injectable()
export default class CustomMailerService {
  constructor(
    @Inject(LOGGER_KEY) private readonly _logger: ILogger,
    private readonly _mailerService: MailerService
  ) {}

  async sendMail(options: ISendMailOptions) {
    try {
      await this._mailerService.sendMail(options)
    } catch (error) {
      this._logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
    this._logger.info('An email was sent')
  }
}
