import { Module } from '@nestjs/common'
import type { DynamicModule } from '@nestjs/common'
import { ConfigService } from '@infra/config/config.service'
import { DynamicMailOptions, IMailerConfig } from './interface'
import { MailerModule } from '@nestjs-modules/mailer'
import CustomMailerService from './mailer.service'
import { GMAIL_SERVICE as GMAIL_SERVICE } from './mailer.constant'

@Module({})
export class DynamicMailerModule {
  static registerAsync(options?: DynamicMailOptions): DynamicModule {
    const { isGlobal } = options ?? { isGlobal: false }

    return {
      module: DynamicMailerModule,
      imports: [
        MailerModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            const config = configService.get<IMailerConfig>('mailer')

            if (!config) {
              throw new Error('Mailer configuration is not set')
            }

            return {
              ...config
            }
          },
          inject: [ConfigService]
        })
      ],
      providers: [{ provide: GMAIL_SERVICE, useClass: CustomMailerService }],
      exports: [GMAIL_SERVICE],
      global: isGlobal
    }
  }
}
