import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { GoogleStrategy, JwtStrategy } from './strategies'
import { UserModule } from '@core/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { DynamicJwtModule } from './strategies/jwt/jwt.module'

@Module({
  imports: [
    DynamicJwtModule.registerAsync(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy]
})
export class AuthModule {}
