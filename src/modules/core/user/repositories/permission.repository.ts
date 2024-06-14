import { BaseRepository } from '@common/base'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Permission } from '../entities'

export class PermissionRepository extends BaseRepository<Permission> {
  constructor(@InjectRepository(Permission) private readonly _repository: Repository<Permission>) {
    super(_repository)
  }

  //TODO: Implement Permission repository methods
}
