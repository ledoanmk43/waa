import { AuthRepository } from '@core/auth/auth.repository'
import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { Cron, SchedulerRegistry } from '@nestjs/schedule'
import { LessThanOrEqual } from 'typeorm'
import { ECronPattern } from './ cron-pattern.enum'
import { ILogger } from '@infra/logger/interface'
import { LOGGER_KEY } from '@infra/logger/logger.constant'
import { ECommonInforMessage } from '@common/enums'

@Injectable()
export default class CronJobService extends SchedulerRegistry implements OnModuleInit {
  constructor(
    @Inject(LOGGER_KEY) private _logger: ILogger,
    private readonly _schedulerRegistry: SchedulerRegistry,
    private readonly _authRepository: AuthRepository
  ) {
    super()
  }

  async onModuleInit() {
    try {
      await this.clearExpiredRefreshToken()
    } catch (error) {
      this._logger.error(error.message)
      throw new BadRequestException(error.message)
    }
  }

  @Cron(ECronPattern.EVERY_DAY_AT_MIDNIGHT)
  async clearExpiredRefreshToken() {
    const today = new Date()

    try {
      const tokens = await this._authRepository.find({
        where: { expireDate: LessThanOrEqual(today) }
      })

      if (tokens?.length) {
        const ids = tokens.map((token) => token.id)
        await this._authRepository.deleteMany(ids)
        this._logger.info(`[${ids.length}] ${ECommonInforMessage.EXPIRED_REFRESH_TOKEN_REMOVED}}`)
      }
    } catch (error) {
      this._logger.error(error.message)
      throw new BadRequestException(error.message)
    }

    this._logger.info(`${today.toLocaleString()} - ${ECommonInforMessage.NO_REFRESH_TOKEN_FOUND}`)
  }
}
