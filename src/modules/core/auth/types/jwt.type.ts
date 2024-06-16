export type TJwtPayload = {
  id?: string
  email?: string
  roleIds?: string[]
  accessToken?: string
  refreshToken?: string
  iat?: number
  exp?: number
}

export type TJwt_Secret = 'AC_JWT_SECRET' | 'RF_JWT_SECRET'
