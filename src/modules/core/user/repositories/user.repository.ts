import { BaseRepository } from '@common/base'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities'

export class UserRepository extends BaseRepository<User> {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {
    super(repository)
  }

  //TODO: Implement user repository methods
}
