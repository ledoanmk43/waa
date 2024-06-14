import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { JWT_ACCESS_GUARD } from '../constants'

@Injectable()
export class JwtAccessGuard extends AuthGuard(JWT_ACCESS_GUARD) {}
