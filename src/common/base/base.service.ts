import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@common/base/base.repository'
import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions } from 'typeorm'
import { BaseEntity } from './base.entity'

@Injectable()
export abstract class BaseService<T extends BaseEntity> {
  constructor(private readonly baseRepository: BaseRepository<T>) {}

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.baseRepository.find(options)
  }

  findOne(options: FindOneOptions<T>): Promise<T | undefined> {
    return this.baseRepository.findOne(options)
  }

  create(entity: DeepPartial<T>): T {
    return this.baseRepository.create(entity)
  }

  async save(entity: DeepPartial<T>): Promise<T> {
    return await this.baseRepository.save(entity)
  }

  updateById(id: number | string, entity: DeepPartial<T>): Promise<T> {
    return this.baseRepository.updateById(id, entity)
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.baseRepository.delete(id)
  }
}
