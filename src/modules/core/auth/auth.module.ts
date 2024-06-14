import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { GoogleStrategy, JwtAccessStrategy, JwtRefreshStrategy } from './strategies'
import { UserModule } from '@core/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [JwtModule.register({}), PassportModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, GoogleStrategy]
})
export class AuthModule {}
