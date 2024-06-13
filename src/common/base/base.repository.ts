import { DeepPartial, DeleteResult, FindManyOptions, FindOptionsWhere, Repository } from 'typeorm'
import { BaseEntity } from './base.entity'

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(private readonly baseRepository: Repository<T>) {}

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.baseRepository.find(options)
  }

  findOne(options: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T | undefined> {
    return this.baseRepository.findOneBy(options)
  }

  create(entity: DeepPartial<T>): T {
    return this.baseRepository.create(entity)
  }

  async save(entity: DeepPartial<T>): Promise<T> {
    return await this.baseRepository.save(entity)
  }

  updateById(id: number | string, entity: DeepPartial<T>): Promise<T> {
    return this.baseRepository.save({ ...entity, id })
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.baseRepository.delete(id)
  }
}
