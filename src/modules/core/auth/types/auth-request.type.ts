import { FastifyRequest } from 'fastify'
import { TJwtPayload } from './jwt.type'

// Make a Request in NestJs return an additional property named 'user' (type TJwtPayload) with specific type (AuthReq)
export type TCustomRequest = FastifyRequest & { user: TJwtPayload } // Request from FastifyRequest

// Use for Google OAuth Sign in request
export type TCustomOAuthRequest = FastifyRequest & { user: TOAuthPayload }

export type TOAuthPayload = {
  email: string
  firstName: string
  lastName: string
}
