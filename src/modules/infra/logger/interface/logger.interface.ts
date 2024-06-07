import { ELogLevel } from '../logger.enum'

export interface ILogger {
  log(level: ELogLevel, message: string | Error, data?: ILogData, profile?: string): void
  debug(message: string, data?: ILogData, profile?: string): void
  info(message: string, data?: ILogData, profile?: string): void
  warn(message: string | Error, data?: ILogData, profile?: string): void
  error(message: string | Error, data?: ILogData, profile?: string): void
  fatal(message: string | Error, data?: ILogData, profile?: string): void
  emergency(message: string | Error, data?: ILogData, profile?: string): void
  startProfile(id: string): void
}

export interface ILog {
  timestamp: number // Unix timestamp
  level: ELogLevel // Log level
  message: string // Log message
  data: ILogData // Log data
}

export interface ILogData {
  organization?: string // Organization or project name
  context?: string // Bounded Context name
  app?: string // Application or Microservice name
  sourceClass?: string // Classname of the source
  correlationId?: string // Correlation ID
  error?: Error // Error object
  props?: NodeJS.Dict<any> // Additional custom properties
}
