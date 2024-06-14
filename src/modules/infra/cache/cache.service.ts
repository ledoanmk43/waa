import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { ETimeUnit } from '@common/enums'
import { Cache } from 'cache-manager'

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly _cacheManager: Cache) {}

  async get<T>(key: string, isObject = true): Promise<T | null> {
    const data = await this._cacheManager.get<string>(key)
    if (!data) return null

    return isObject ? JSON.parse(data) : data
  }

  async set<T>(key: string, value: T, ttl: number = ETimeUnit.HOUR_IN_MILLISECONDS) {
    const data = typeof value === 'object' ? JSON.stringify(value) : value
    void this._cacheManager.set(key, data, ttl)
  }

  async del(key: string) {
    const data = await this._cacheManager.get<string>(key)
    if (!data) return

    await this._cacheManager.del(key)
  }

  async wrapCacheRead<T>(
    key: string,
    callback: () => Promise<T>,
    ttl: number = ETimeUnit.HOUR_IN_MILLISECONDS
  ): Promise<T> {
    const data = await this.get<T>(key)
    if (data) return data

    const result = await callback()
    void this.set(key, result, ttl)

    return result
  }

  async wrapCacheWrite<T>(
    key: string,
    callback: () => Promise<T>,
    ttl: number = ETimeUnit.HOUR_IN_MILLISECONDS
  ): Promise<T> {
    const result = await callback()
    void this.set(key, result, ttl)

    return result
  }

  async wrapCacheDel<T>(key: string, callback: () => Promise<T>): Promise<T> {
    const result = await callback()
    void this.del(key)

    return result
  }

  async wrapCacheClear<T>(key: string, callback: () => Promise<T>): Promise<T> {
    const result = await callback()
    void this.clearPrefixCache(key)

    return result
  }

  async clearPrefixCache(prefix: string): Promise<number> {
    const keys = await this._cacheManager.store.keys(`${prefix}*`)
    if (keys.length === 0) {
      return 0
    }

    for (const key of keys) {
      await this._cacheManager.del(key)
    }

    return keys.length
  }
}
