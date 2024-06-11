import type { IDefaultConfig } from './interface'

const initConfig = (): IDefaultConfig => ({
  env: process.env.NODE_ENV ?? 'local',
  port: parseInt(process.env.PORT ?? '3001', 10),
  org: process.env.ORG_NAME ?? 'waa',
  context: process.env.CONTEXT_NAME ?? 'waa',
  app: process.env.APP_NAME ?? 'waa-app-be',
  serviceName: process.env.SERVICE_NAME ?? 'WAA App BE'
})

export const defaultConfig = () => ({ default: initConfig() })
