import { dbConfig } from '@infra/database/database.config'
import { DynamicConfigModule } from '@infra/config/config.module'
import { defaultConfig } from '@infra/config/default.config'
import { DynamicDatabaseModule } from '@infra/database/database.module'
import { Module } from '@nestjs/common'
import { DynamicLoggerModule } from '@infra/logger/logger.module'
import { DynamicContextModule } from '@infra/context/context.module'

@Module({
  imports: [
    DynamicConfigModule.registerAsync({
      isGlobal: true,
      load: [dbConfig, defaultConfig]
    }),
    DynamicContextModule.registerAsync(),
    DynamicLoggerModule.registerAsync(),
    DynamicDatabaseModule.registerAsync()
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
