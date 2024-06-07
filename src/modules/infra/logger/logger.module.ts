import { DynamicModule, Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import * as morgan from 'morgan'
import { IDynamicLoggerModuleOptions, ILogger } from './interface'
import LoggerAdapterService from './logger-adapter.service'
import { LOGGER_BASE_KEY, LOGGER_KEY } from './logger.constant'
import { LoggerService } from './logger.service'
import ConsoleTransport from './winston/transports/console.transport'
import FileTransport from './winston/transports/file-transport'
import {
  WINSTON_LOGGER_TRANSPORT__KEY,
  WinstonLoggerService
} from './winston/winston-logger.service'

@Module({})
export class DynamicLoggerModule implements NestModule {
  static registerAsync(options?: IDynamicLoggerModuleOptions): DynamicModule {
    const { isGlobal } = options ?? { isGlobal: true }
    return {
      module: DynamicLoggerModule,
      imports: [],
      providers: [
        {
          provide: LOGGER_BASE_KEY,
          useClass: WinstonLoggerService
        },
        {
          provide: LOGGER_KEY,
          useClass: LoggerService
        },
        {
          provide: LoggerAdapterService,
          useFactory: (logger: ILogger) => new LoggerAdapterService(logger),
          inject: [LOGGER_KEY]
        },
        {
          provide: WINSTON_LOGGER_TRANSPORT__KEY,
          useFactory: () => {
            const transports = []

            transports.push(ConsoleTransport.createColorize())

            transports.push(FileTransport.create())

            return transports
          }
        }
      ],
      exports: [LOGGER_KEY, LoggerAdapterService],
      global: isGlobal
    }
  }

  public constructor(@Inject(LOGGER_KEY) private logger: ILogger) {}

  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        morgan(
          (tokens, req, res) => {
            return [
              tokens.method(req, res),
              tokens.url(req, res),
              tokens.status(req, res),
              tokens.res(req, res, 'content-length'),
              '-',
              tokens['response-time'](req, res),
              'ms',
              'IP:',
              tokens['remote-addr'](req, res)
            ].join(' ')
          },
          {
            stream: {
              write: (message: string) => {
                this.logger.debug(message, {
                  sourceClass: 'RequestLogger'
                })
              }
            }
          }
        )
      )
      .forRoutes('*')
  }
}
