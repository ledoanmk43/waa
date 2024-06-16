import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GOOGLE_OAUTH_GUARD } from '../constants'

@Injectable()
export class GoogleOauthGuard extends AuthGuard(GOOGLE_OAUTH_GUARD) {}
