import { Request } from 'express'
import { IJwtPayload } from '../strategies'

// Make a Request in NestJs return an additional property named 'user' (type JwtPayload) with specific type (AuthReq)
export type AuthReq = Request & { user: IJwtPayload } // Request from express

export type OAuthReq = Request & { user: OAuthUser }

export type OAuthUser = {
  email: string
  firstName: string
  lastName: string
}
