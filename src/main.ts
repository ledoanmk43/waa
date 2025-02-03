import { CustomBadRequestException } from '@common/exceptions'
import fastifyCsrf from '@fastify/csrf-protection'
import helmet from '@fastify/helmet'
import { ConfigService } from '@infra/config/config.service'
import { IDefaultConfig } from '@infra/config/interface'
import LoggerAdapterService from '@infra/logger/logger-adapter.service'
import { ClassSerializerInterceptor, Logger, ValidationError, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { description as pkDescription, name as pkName, version as pkVersion } from '../package.json'
import { AppModule } from './app.module'
import { JwtAccessGuard } from '@common/guards'

const prefix = 'waa/api'
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    cors: true,
    bufferLogs: true
  })

  const reflector = app.get(Reflector)
  app.setGlobalPrefix(prefix)

  app.useGlobalGuards(new JwtAccessGuard(reflector))

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  const configService = app.get(ConfigService)
  const defaultConfig = configService.get<IDefaultConfig>('default')

  await app.register(helmet)
  await app.register(fastifyCsrf)

  const options = new DocumentBuilder()
    .setTitle(pkName)
    .setDescription(pkDescription)
    .setVersion(pkVersion)
    .addTag(pkName, pkDescription)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup(`${prefix}/apidoc`, app, document)
  app.use(`${prefix}/apidoc-json/`, (_: FastifyRequest, res: FastifyReply) => res.send(document))

  app.useLogger(app.get(LoggerAdapterService))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]): CustomBadRequestException => {
        return CustomBadRequestException.fromValidationErrors(errors)
      }
    })
  )

  const port = defaultConfig.port

  await app.startAllMicroservices()
  await app.listen(port, '0.0.0.0')
  Logger.log(`🚀 ${defaultConfig.serviceName} is running on: http://localhost:${port}`)
}

bootstrap()
