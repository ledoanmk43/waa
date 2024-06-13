import { Module, DynamicModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { IDynamicJwtModuleOptions, IJwtConfig } from './interface'

@Module({})
export class DynamicJwtModule {
  static registerAsync(options?: IDynamicJwtModuleOptions): DynamicModule {
    const { isGlobal } = options ?? { isGlobal: false }
    return {
      module: DynamicJwtModule,
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            const config = configService.get<IJwtConfig>('jwt')
            return {
              secret: config.secret,
              signOptions: {
                expiresIn: config.expiresIn
              }
            }
          },
          inject: [ConfigService]
        })
      ],
      global: isGlobal
    }
  }
}
