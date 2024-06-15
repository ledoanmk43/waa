import { NamingStrategyInterface } from 'typeorm'

export interface IDatabaseConfig {
  host: string
  port: number
  username: string
  password: string
  database: string
  entities: string[]
  subscribers: string[]
  namingStrategy: NamingStrategyInterface
  autoLoadEntities: boolean
  keepConnectionAlive: boolean
  logging?: boolean
  timezone?: string
}
