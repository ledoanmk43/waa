import { Module } from '@nestjs/common'
import type { DynamicModule } from '@nestjs/common'
import { DynamicCronJobOptions } from './interface'
import CronJobService from './cron.service'
import { AuthModule } from '@core/auth/auth.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({})
export class DynamicCronJobModule {
  static registerAsync(options?: DynamicCronJobOptions): DynamicModule {
    const { isGlobal } = options ?? { isGlobal: false }

    return {
      module: DynamicCronJobModule,
      imports: [AuthModule, ScheduleModule.forRoot()],
      providers: [CronJobService],
      global: isGlobal
    }
  }
}
