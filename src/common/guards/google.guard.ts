import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GOOGLE_OAUTH_GUARD } from '../../modules/core/auth/constants'

@Injectable()
export class GoogleOauthGuard extends AuthGuard(GOOGLE_OAUTH_GUARD) {}
