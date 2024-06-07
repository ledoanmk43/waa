import * as winston from 'winston'
import { Inject, Injectable } from '@nestjs/common'
import { ILogData, ILogger } from '../interface'
import { ELogLevel } from '../logger.enum'

export const WINSTON_LOGGER_TRANSPORT__KEY = Symbol()

@Injectable()
export class WinstonLoggerService implements ILogger {
  private logger: winston.Logger

  public constructor(@Inject(WINSTON_LOGGER_TRANSPORT__KEY) transports: winston.transport[]) {
    // Create winston logger
    this.logger = winston.createLogger(this.getLoggerFormatOptions(transports))
  }

  private getLoggerFormatOptions(transports: winston.transport[]) {
    // Setting log levels for winston
    const levels: any = {}
    let cont = 0
    Object.values(ELogLevel).forEach((level) => {
      levels[level] = cont
      cont++
    })

    return {
      level: ELogLevel.Debug,
      levels: levels,
      format: winston.format.combine(
        // Add timestamp and format the date
        winston.format.timestamp({
          format: 'DD/MM/YYYY, HH:mm:ss'
        }),
        // Errors will be logged with stack trace
        winston.format.errors({ stack: true }),
        // Add custom Log fields to the log
        winston.format((info) => {
          // Info contains an Error property
          if (info.error && info.error instanceof Error) {
            info.stack = info.error.stack
            info.error = undefined
          }

          info.label = `${info.organization}.${info.context}.${info.app}`

          return info
        })(),
        // Add custom fields to the data property
        winston.format.metadata({
          key: 'data',
          fillExcept: ['timestamp', 'level', 'message']
        }),
        // Format the log as JSON
        winston.format.json()
      ),
      transports: transports,
      exceptionHandlers: transports,
      rejectionHandlers: transports
    }
  }

  public log(level: ELogLevel, message: string | Error, data?: ILogData, profile?: string) {
    const logData = {
      level: level,
      message: message instanceof Error ? message.message : message,
      error: message instanceof Error ? message : undefined,
      ...data
    }

    // if we already startProfile, this will end the profiling. Otherwise, it starts a new profiling
    if (profile) {
      this.logger.profile(profile, logData)
    } else {
      this.logger.log(logData)
    }
  }

  public debug(message: string, data?: ILogData, profile?: string) {
    this.log(ELogLevel.Debug, message, data, profile)
  }

  public info(message: string, data?: ILogData, profile?: string) {
    this.log(ELogLevel.Info, message, data, profile)
  }

  public warn(message: string | Error, data?: ILogData, profile?: string) {
    this.log(ELogLevel.Warn, message, data, profile)
  }

  public error(message: string | Error, data?: ILogData, profile?: string) {
    this.log(ELogLevel.Error, message, data, profile)
  }

  public fatal(message: string | Error, data?: ILogData, profile?: string) {
    this.log(ELogLevel.Fatal, message, data, profile)
  }

  public emergency(message: string | Error, data?: ILogData, profile?: string) {
    this.log(ELogLevel.Emergency, message, data, profile)
  }

  public startProfile(id: string) {
    this.logger.profile(id)
  }
}
