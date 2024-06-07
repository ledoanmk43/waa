import { Injectable } from '@nestjs/common'
import { ConfigService as NestjsConfigService } from '@nestjs/config'

@Injectable()
export class ConfigService {
  constructor(private readonly _configService: NestjsConfigService) {}

  get<T = unknown>(name: string): T {
    return this._configService.get<T>(name) as T
  }
}
