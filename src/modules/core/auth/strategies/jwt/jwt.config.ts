import { ETimeUnit } from '@common/enums'
import { IJwtConfig } from './interface'

const initConfig = (): IJwtConfig => {
  return {
    secret: process.env.JWT_SECRET ?? 'secret',
    expiresIn: ETimeUnit.HOUR_IN_SECONDS
  }
}

export const jwtConfig = (): { jwt: IJwtConfig } => ({ jwt: initConfig() })
