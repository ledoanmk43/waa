import { ConsoleLogger, LoggerService } from '@nestjs/common'
import { ILogger } from './interface'

export default class LoggerAdapterService extends ConsoleLogger implements LoggerService {
  public constructor(private logger: ILogger) {
    super()
  }

  public log(message: any, ...optionalParams: any[]) {
    return this.logger.info(message, this.getLogData(optionalParams))
  }

  public error(message: any, ...optionalParams: any[]) {
    return this.logger.error(message, this.getLogData(optionalParams))
  }

  public warn(message: any, ...optionalParams: any[]) {
    return this.logger.warn(message, this.getLogData(optionalParams))
  }

  public debug(message: any, ...optionalParams: any[]) {
    return this.logger.debug(message, this.getLogData(optionalParams))
  }

  public verbose(message: any, ...optionalParams: any[]) {
    return this.logger.info(message, this.getLogData(optionalParams))
  }

  private getLogData(...optionalParams: any[]) {
    return {
      sourceClass: optionalParams[0] ? optionalParams[0] : undefined
    }
  }
}
