import { Module } from '@nestjs/common'
import type { DynamicModule } from '@nestjs/common'
import type { DynamicDatabaseOptions } from './interface/database-module-config.interface'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@infra/config/config.service'
import { IDatabaseConfig } from './interface'
import { EntityHistorySubscriber } from './subscriber'

@Module({})
export class DynamicDatabaseModule {
  static registerAsync(options?: DynamicDatabaseOptions): DynamicModule {
    const { isGlobal } = options ?? { isGlobal: false }

    return {
      module: DynamicDatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            const config = configService.get<IDatabaseConfig>('db')

            if (!config) {
              throw new Error('Database configuration is not set')
            }

            return {
              type: 'postgres',
              ...config
            }
          },
          inject: [ConfigService]
        })
      ],
      providers: [EntityHistorySubscriber],
      global: isGlobal
    }
  }
}
