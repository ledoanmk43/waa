import { BaseService } from '@common/base'
import { ILogger } from '@infra/logger/interface'
import { LOGGER_KEY } from '@infra/logger/logger.constant'
import { Inject, Injectable } from '@nestjs/common'
import { Permission } from '../entities'
import { PermissionRepository } from '../repositories'

@Injectable()
export class PermissionService extends BaseService<Permission> {
  constructor(
    @Inject(LOGGER_KEY) private logger: ILogger,
    private readonly repository: PermissionRepository
  ) {
    super(repository)
  }
  //TODO: Implement Permission service methods
}
