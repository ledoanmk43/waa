export interface IJwtPayload {
  id?: string
  email?: string
  roleIds?: string[]
  accessToken?: string
  refreshToken?: string
}
