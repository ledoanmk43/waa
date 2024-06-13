import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, StrategyOptions, VerifyCallback } from 'passport-google-oauth20'

import { Injectable } from '@nestjs/common'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET,
      callbackURL: 'http://localhost:8000/auth/google-redirect',
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
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName
    }
    done(null, user)
  }
}
