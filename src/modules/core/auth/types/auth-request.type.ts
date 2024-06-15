import { FastifyRequest } from 'fastify'
import { TJwtPayload } from './jwt-payload.type'

// Make a Request in NestJs return an additional property named 'user' (type JwtPayload) with specific type (AuthReq)
export type TCustomRequest = FastifyRequest & { user: TJwtPayload } // Request from FastifyRequest

export type TCustomOAuthRequest = FastifyRequest & { user: TOAuthPayload }

export type TOAuthPayload = {
  email: string
  firstName: string
  lastName: string
}
