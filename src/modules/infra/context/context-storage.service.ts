import { CLS_ID, ClsService } from 'nestjs-cls'
import { Injectable } from '@nestjs/common'
import { IContextStorage } from './interface'

@Injectable()
export default class ContextStorageService implements IContextStorage {
  constructor(private readonly cls: ClsService) {}

  public get<T>(key: string): T | undefined {
    return this.cls.get(key)
  }

  public setContextId(id: string) {
    this.cls.set(CLS_ID, id)
  }

  public getContextId(): string | undefined {
    return this.cls.getId()
  }

  public set<T>(key: string, value: T): void {
    this.cls.set(key, value)
  }
}
