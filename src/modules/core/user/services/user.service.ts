import { BaseService } from '@common/base'
import { ILogger } from '@infra/logger/interface'
import { LOGGER_KEY } from '@infra/logger/logger.constant'
import { Inject, Injectable } from '@nestjs/common'
import { UserRepository } from '../repositories/user.repository'
import { User } from '../entities'

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @Inject(LOGGER_KEY) private logger: ILogger,
    private readonly repository: UserRepository
  ) {
    super(repository)
  }
  //TODO: Implement user service methods
}
