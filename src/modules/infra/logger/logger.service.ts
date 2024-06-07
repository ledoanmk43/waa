import { Inject, Injectable, Scope } from '@nestjs/common'
import { INQUIRER } from '@nestjs/core'
import { ILogData, ILogger } from './interface'
import { LOGGER_BASE_KEY } from './logger.constant'
import { ELogLevel } from './logger.enum'
import { ConfigService } from '@infra/config/config.service'
import { IDefaultConfig } from '@infra/config/interface'
import { CONTEXT_STORAGE_KEY } from '@infra/context/context.constant'
import { IContextStorage } from '@infra/context/interface'

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements ILogger {
  private organization: string
  private context: string
  private app: string
  private sourceClass: string

  public constructor(
    @Inject(LOGGER_BASE_KEY) private logger: ILogger,
    configService: ConfigService,
    @Inject(INQUIRER) parentClass: object,
    @Inject(CONTEXT_STORAGE_KEY)
    private contextStorageService: IContextStorage
  ) {
    // Set the source class from the parent class
    this.sourceClass = parentClass?.constructor?.name

    // Set the organization, context and app from the environment variables
    const config = configService.get<IDefaultConfig>('default')
    this.organization = config.org
    this.context = config.context
    this.app = config.app
  }

  public log(level: ELogLevel, message: string | Error, data?: ILogData, profile?: string) {
    return this.logger.log(level, message, this.getLogData(data), profile)
  }

  public debug(message: string, data?: ILogData, profile?: string) {
    return this.logger.debug(message, this.getLogData(data), profile)
  }

  public info(message: string, data?: ILogData, profile?: string) {
    return this.logger.info(message, this.getLogData(data), profile)
  }

  public warn(message: string | Error, data?: ILogData, profile?: string) {
    return this.logger.warn(message, this.getLogData(data), profile)
  }

  public error(message: string | Error, data?: ILogData, profile?: string) {
    return this.logger.error(message, this.getLogData(data), profile)
  }

  public fatal(message: string | Error, data?: ILogData, profile?: string) {
    return this.logger.fatal(message, this.getLogData(data), profile)
  }

  public emergency(message: string | Error, data?: ILogData, profile?: string) {
    return this.logger.emergency(message, this.getLogData(data), profile)
  }

  private getLogData(data?: ILogData): ILogData {
    return {
      ...data,
      organization: data?.organization || this.organization,
      context: data?.context || this.context,
      app: data?.app || this.app,
      sourceClass: data?.sourceClass || this.sourceClass,
      correlationId: data?.correlationId || this.contextStorageService.getContextId()
    }
  }

  public startProfile(id: string) {
    this.logger.startProfile(id)
  }
}
