import { BaseRepository } from '@common/base'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlacklistRefreshToken } from './entities'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthRepository extends BaseRepository<BlacklistRefreshToken> {
  constructor(
    @InjectRepository(BlacklistRefreshToken)
    private readonly _repository: Repository<BlacklistRefreshToken>
  ) {
    super(_repository)
  }

  //TODO: Implement Role repository methods
}
