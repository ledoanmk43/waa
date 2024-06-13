import { FindOptionsWhere } from 'typeorm'

export type TCustomOption<T> = FindOptionsWhere<T> | FindOptionsWhere<T>[]
