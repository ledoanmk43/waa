import { DynamicModule, Module } from '@nestjs/common'
import { v4 } from 'uuid'
import { IDynamicContextModuleOptions } from './interface'
import { CONTEXT_STORAGE_KEY } from './context.constant'
import ContextStorageService from './context-storage.service'
import { ClsModule } from 'nestjs-cls'

@Module({})
export class DynamicContextModule {
  static registerAsync(options?: IDynamicContextModuleOptions): DynamicModule {
    const { isGlobal } = options ?? { isGlobal: true }
    return {
      module: DynamicContextModule,
      imports: [
        ClsModule.forRoot({
          global: true,
          middleware: {
            mount: true,
            generateId: true,
            idGenerator: (req: Request) => req.headers['x-correlation-id'] ?? v4()
          }
        })
      ],
      providers: [{ provide: CONTEXT_STORAGE_KEY, useClass: ContextStorageService }],
      exports: [CONTEXT_STORAGE_KEY],
      global: isGlobal
    }
  }
}
