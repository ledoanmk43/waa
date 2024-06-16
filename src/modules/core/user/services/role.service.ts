import { ILogger } from '@infra/logger/interface'
import { LOGGER_KEY } from '@infra/logger/logger.constant'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Role } from '../entities'
import { RoleRepository } from '../repositories'
import { BaseService } from '@common/base'
import { ERoleMessage } from '@common/enums'

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    @Inject(LOGGER_KEY) private _logger: ILogger,
    private readonly _repository: RoleRepository
  ) {
    super(_repository)
  }

  async searchRoleByCondition(condition: any): Promise<Role> {
    try {
      const role = await this._repository.findOne(condition)
      if (!role) {
        throw new Error(ERoleMessage.NOT_FOUND)
      }

      return role
    } catch (error) {
      this._logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }

  async addRole(roleDto: Role): Promise<Role> {
    try {
      const newRole = this._repository.create(roleDto)
      const role = await this._repository.save(newRole)

      return role
    } catch (error) {
      this._logger.error(error.message)
      if (error.message.includes('duplicate key')) {
        throw new HttpException(ERoleMessage.ALREADY_EXISTS, HttpStatus.CONFLICT)
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async searchListRoleByCondition(condition: any): Promise<Role[]> {
    try {
      const roles = await this._repository.find(condition)
      if (!roles.length) {
        throw new Error(ERoleMessage.NOT_FOUND)
      }

      return roles
    } catch (error) {
      this._logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }
}
