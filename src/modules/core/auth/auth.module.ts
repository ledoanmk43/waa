import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { GoogleStrategy, JwtAccessStrategy, JwtRefreshStrategy } from './strategies'
import { UserModule } from '@core/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlacklistRefreshToken } from './entities'
import { AuthRepository } from './auth.repository'

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({}),
    UserModule,
    TypeOrmModule.forFeature([BlacklistRefreshToken])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, GoogleStrategy, AuthRepository]
})
export class AuthModule {}
