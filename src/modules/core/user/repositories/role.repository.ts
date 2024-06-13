import { BaseRepository } from '@common/base'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role } from '../entities'

export class RoleRepository extends BaseRepository<Role> {
  constructor(@InjectRepository(Role) private readonly repository: Repository<Role>) {
    super(repository)
  }

  //TODO: Implement Role repository methods
}
