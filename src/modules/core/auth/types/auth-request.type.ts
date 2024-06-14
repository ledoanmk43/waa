import { Request } from 'express'
import { TJwtPayload } from './jwt-payload.type'

// Make a Request in NestJs return an additional property named 'user' (type JwtPayload) with specific type (AuthReq)
export type TCustomRequest = Request & { user: TJwtPayload } // Request from express

export type TCustomOAuthRequest = Request & { user: TOAuthPayload }

export type TOAuthPayload = {
  email: string
  firstName: string
  lastName: string
}
