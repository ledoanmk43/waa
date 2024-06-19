import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { JWT_ACCESS_GUARD, PublicMetadata } from '../../modules/core/auth/constants'
import { Reflector } from '@nestjs/core'

@Injectable()
export class JwtAccessGuard extends AuthGuard(JWT_ACCESS_GUARD) {
  constructor(private readonly _reflector: Reflector) {
    super()
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this._reflector.get<boolean>(PublicMetadata, context.getHandler())
    console.log(isPublic)
    return !!isPublic || super.canActivate(context)
  }
}
