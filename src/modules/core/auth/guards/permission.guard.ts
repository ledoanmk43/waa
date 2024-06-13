import { ECommonMessage } from '@common/enums'
import { Role } from '@core/user/entities'
import { RoleService } from '@core/user/services'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { In } from 'typeorm'

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const fromRequestPermissions = this.reflector.get<string[]>('PERMISSION', context.getHandler())
    if (!fromRequestPermissions) {
      return false
    }
    try {
      const request = context.switchToHttp().getRequest()
      const listPermissionName: string[] = await this.searchListPermissionNameByRoleId(
        request.user.roleIds
      )
      return this.hasPermission(listPermissionName, fromRequestPermissions)
    } catch (error) {
      Logger.error(error.message)
      throw new UnauthorizedException(error.message)
    }
  }

  // Check target permission and user permission if match
  hasPermission(fromDbPermissions: string[], fromRequestPermissions: string[]): boolean {
    const hasPermission = fromRequestPermissions.every((permission) =>
      fromDbPermissions.includes(permission)
    )
    if (hasPermission) {
      return true
    }
    throw new Error(ECommonMessage.FORBIDDEN)
  }

  async searchListPermissionNameByRoleId(ids: string[]): Promise<string[]> {
    const roles: Role[] = await this.roleService.searchListRoleByCondition({
      where: {
        id: In(ids)
      },
      relations: ['permissions']
    })

    return roles.flatMap((role) => role.permissions.map((permission) => permission.name))
  }
}
