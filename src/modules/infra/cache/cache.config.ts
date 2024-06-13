import type { ICacheConfig } from './interface'

const initConfig = (): ICacheConfig => {
  return {
    host: process.env.CACHE_HOST ?? 'localhost',
    port: process.env.CACHE_PORT ?? '6379',
    username: process.env.CACHE_USERNAME ?? '',
    pwd: process.env.CACHE_PWD ?? ''
  }
}

export const cacheConfig = (): { cache: ICacheConfig } => ({ cache: initConfig() })
