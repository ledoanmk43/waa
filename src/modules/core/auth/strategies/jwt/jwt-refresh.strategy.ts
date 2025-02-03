import { AuthRepository } from '@core/auth/auth.repository'
import { JWT_REFRESH_GUARD } from '@core/auth/constants'
import { TJwtPayload } from '@core/auth/types'
import { UserService } from '@core/user/services'
import { ConfigService } from '@infra/config/config.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, JWT_REFRESH_GUARD) {
  constructor(
    private readonly _userService: UserService,
    private readonly _configService: ConfigService,
    private readonly _repository: AuthRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get<string>('RF_JWT_SECRET'),
      passReqToCallback: true
    })
  }

  async validate(req: FastifyRequest, payload: TJwtPayload): Promise<TJwtPayload> {
    // Set refresh token from header Authorization
    payload.refreshToken = req.headers.authorization.split(' ')[1]

    // Then check it in postgres blacklist
    const token = await this._repository.findOne({ where: { token: payload.refreshToken } })
    if (token) {
      throw new UnauthorizedException()
    }

    // Else
    const { id, email } = payload
    const user = await this._userService.searchUserByCondition({
      where: { id: id, email: email }
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    // Finally
    return payload
  }
}
