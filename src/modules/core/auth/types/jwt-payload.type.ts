export type TJwtPayload = {
  id?: string
  email?: string
  roleIds?: string[]
  accessToken?: string
  refreshToken?: string
  iat?: number
  exp?: number
}
