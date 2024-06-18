import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent
} from 'typeorm'
import { Inject } from '@nestjs/common'
import { TJwtPayload } from '@core/auth/types'
import { CX_HISTORY_ENTITY } from '@common/constants'
import ContextStorageService from '@infra/context/context-storage.service'
import { CONTEXT_STORAGE_KEY } from '@infra/context/context.constant'

const today = new Date()

@EventSubscriber()
export class EntityHistorySubscriber implements EntitySubscriberInterface {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    @Inject(CONTEXT_STORAGE_KEY)
    private readonly cls: ContextStorageService
  ) {
    dataSource.subscribers.push(this)
  }

  async beforeInsert(event: InsertEvent<any>): Promise<void> {
    const user: TJwtPayload = this.cls.get(CX_HISTORY_ENTITY)
    if (user) {
      event.entity.createdBy = user.id
      event.entity.updatedBy = user.id
      event.entity.createdDate = today
      event.entity.updatedDate = today
    }
  }

  async beforeUpdate(event: UpdateEvent<any>): Promise<void> {
    const user: TJwtPayload = this.cls.get(CX_HISTORY_ENTITY)
    if (user) {
      event.entity.updatedBy = user.id
      event.entity.updatedDate = today
    }
  }
}
