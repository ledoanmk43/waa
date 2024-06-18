import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, StrategyOptions, VerifyCallback } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'
import { TOAuthPayload } from '@core/auth/types'
import { GOOGLE_OAUTH_GUARD } from '@core/auth/constants'
import { ConfigService } from '@infra/config/config.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, GOOGLE_OAUTH_GUARD) {
  constructor(private readonly _configService: ConfigService) {
    super({
      clientID: _configService.get<string>('OAUTH_GOOGLE_CLIENT_ID'),
      clientSecret: _configService.get<string>('OAUTH_GOOGLE_SECRET'),
      callbackURL: _configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile']
    } as StrategyOptions)
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<any> {
    const { name, emails } = profile
    const payload: TOAuthPayload = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName
    }

    done(null, payload)
  }
}
