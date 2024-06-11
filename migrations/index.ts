import { DataSource } from 'typeorm'
import { join } from 'path'
import * as dotenv from 'dotenv'
import { NamingStrategy } from '../src/modules/infra/database/naming-strategy'

dotenv.config({ path: join(__dirname, `../.local.env`) })

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'admin',
  password: process.env.DB_PASSWORD ?? 'admin',
  database: process.env.DB_NAME ?? 'waa',
  entities: [join(__dirname, '../src/**/*.entity.ts')],
  synchronize: false,
  migrationsRun: true,
  logging: true,
  migrationsTableName: '__migrations',
  migrations: [join(__dirname, 'scripts/*.ts')],
  namingStrategy: new NamingStrategy()
})
