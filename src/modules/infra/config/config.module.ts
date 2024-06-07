import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService as NestjsConfigService } from '@nestjs/config'
import type { DynamicModule } from '@nestjs/common'
import type { ConfigModuleOptions } from '@nestjs/config'
import { ConfigService } from './config.service'

@Module({})
export class DynamicConfigModule {
  static registerAsync(options?: ConfigModuleOptions): DynamicModule {
    const { isGlobal, envFilePath, load } = options || {}

    return {
      module: DynamicConfigModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: envFilePath ?? process.cwd() + '/.local.env',
          load
        })
      ],
      providers: [
        {
          provide: ConfigService,
          useFactory: (configService: NestjsConfigService) => new ConfigService(configService),
          inject: [NestjsConfigService]
        }
      ],
      exports: [ConfigService],
      global: isGlobal
    }
  }
}
