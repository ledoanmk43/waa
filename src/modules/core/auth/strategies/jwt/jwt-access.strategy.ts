import { FastifyRequest } from 'fastify'
import { UserService } from '@core/user/services'
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { CacheService } from '@infra/cache/cache.service'
import { ConfigService } from '@infra/config/config.service'
import { JWT_ACCESS_GUARD } from '@core/auth/constants'
import { TJwtPayload } from '@core/auth/types'
import ContextStorageService from '@infra/context/context-storage.service'
import { CONTEXT_STORAGE_KEY } from '@infra/context/context.constant'
import { CX_HISTORY_ENTITY } from '@common/constants'

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, JWT_ACCESS_GUARD) {
  constructor(
    private readonly _cacheService: CacheService,
    private readonly _userService: UserService,
    private readonly configService: ConfigService,
    @Inject(CONTEXT_STORAGE_KEY)
    private readonly cls: ContextStorageService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('AC_JWT_SECRET'),
      passReqToCallback: true
    })
  }

  async validate(req: FastifyRequest, payload: TJwtPayload): Promise<TJwtPayload> {
    const { id, email } = payload
    try {
      // Set access token from header Authorization
      payload.accessToken = req.headers.authorization.split(' ')[1]

      // Then check it in redis cache
      const redisData = await this._cacheService.get(payload.accessToken)

      // If it exists means that token is unexpired but user still log out then block request with that token
      if (redisData) {
        throw new UnauthorizedException()
      }

      // Else
      const user = await this._userService.searchUserByCondition({
        where: { id: id, email: email }
      })

      if (!user) {
        throw new UnauthorizedException()
      }
    } catch (error) {
      Logger.error(error.message)
      throw new UnauthorizedException(error.message)
    }
    // Finally
    // Set user to context storage before insert or update entity
    this.cls.set(CX_HISTORY_ENTITY, payload)
    return payload
  }
}
