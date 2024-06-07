import { resolve } from 'path'
import type { IDatabaseConfig } from './interface'
import { NamingStrategy } from './naming-strategy'

const initConfig = (): IDatabaseConfig => ({
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'admin',
  password: process.env.DB_PASSWORD ?? 'admin',
  database: process.env.DB_NAME ?? 'waa',
  autoLoadEntities: true,
  keepConnectionAlive: true,
  entities: [resolve(__dirname, '**/*.entity.ts')],
  namingStrategy: new NamingStrategy(),
  timezone: 'Z',
  logging: process.env.DB_LOGGING === 'true'
})

export const dbConfig = (): { db: IDatabaseConfig } => ({ db: initConfig() })
