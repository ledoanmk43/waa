import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigService } from '@infra/config/config.service'
import { redisStore } from 'cache-manager-redis-yet'
import type { DynamicModule } from '@nestjs/common'
import type { ICacheConfig } from '@infra/cache/interface'
import { CacheService } from './cache.service'
import type { IDynamicCacheModuleOptions } from './interface'
import type { RedisClientOptions } from 'redis'

@Module({})
export class DynamicCacheModule {
  static registerAsync(options?: IDynamicCacheModuleOptions): DynamicModule {
    const { isGlobal } = options ?? { isGlobal: false }
    return {
      module: DynamicCacheModule,
      imports: [
        CacheModule.registerAsync<RedisClientOptions>({
          useFactory: (configService: ConfigService) => {
            const config = configService.get<ICacheConfig>('cache')
            return {
              store: redisStore,
              url: `redis://${config.host}:${config.port}`
            }
          },
          inject: [ConfigService]
        })
      ],
      providers: [CacheService],
      exports: [CacheService],
      global: isGlobal
    }
  }
}
