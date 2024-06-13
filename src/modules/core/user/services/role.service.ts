import { ILogger } from '@infra/logger/interface'
import { LOGGER_KEY } from '@infra/logger/logger.constant'
import { Inject, Injectable } from '@nestjs/common'
import { Role } from '../entities'
import { RoleRepository } from '../repositories'
import { BaseService } from '@common/base'

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    @Inject(LOGGER_KEY) private logger: ILogger,
    private readonly repository: RoleRepository
  ) {
    super(repository)
  }
  //TODO: Implement Role service methods
}
