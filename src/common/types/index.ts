export * from './custom-typeorm.type'

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>
}

export type Maybe<T> = T | null

export type MaybeUndefined<T> = T | undefined
