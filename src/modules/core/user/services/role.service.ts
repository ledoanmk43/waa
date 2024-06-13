import { ILogger } from '@infra/logger/interface'
import { LOGGER_KEY } from '@infra/logger/logger.constant'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Role } from '../entities'
import { RoleRepository } from '../repositories'
import { BaseService } from '@common/base'
import { ECommonMessage, ERoleMessage } from '@common/enums'

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    @Inject(LOGGER_KEY) private logger: ILogger,
    private readonly repository: RoleRepository
  ) {
    super(repository)
  }

  async searchRoleByCondition(condition: any): Promise<Role> {
    try {
      const role = await this.repository.findOne(condition)
      if (!role) {
        throw new Error(ERoleMessage.NOT_FOUND)
      }

      return role
    } catch (error) {
      this.logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }

  async addRole(roleDto: Role): Promise<Role> {
    try {
      const role = await this.repository.save(roleDto)
      if (!role) {
        throw new Error(ECommonMessage.FAIL_TO_CREATE)
      }

      return role
    } catch (error) {
      this.logger.error(error.message)
      if (error.message.includes('duplicate key')) {
        throw new HttpException(ERoleMessage.ALREADY_EXISTS, HttpStatus.CONFLICT)
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async searchListRoleByCondition(condition: any): Promise<Role[]> {
    try {
      const roles = await this.repository.find(condition)
      if (!roles.length) {
        throw new Error(ERoleMessage.NOT_FOUND)
      }

      return roles
    } catch (error) {
      this.logger.error(error.message)
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }
}