import type { ICronConfig } from './interface'

const initConfig = (): ICronConfig => ({})

export const cronConfig = (): { cron: ICronConfig } => ({ cron: initConfig() })
