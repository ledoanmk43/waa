// import { CACHE_MANAGER } from '@nestjs/cache-manager'
// import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
// import { PassportStrategy } from '@nestjs/passport'
// import { UserService } from '@user/services/user.service'
// import { Cache } from 'cache-manager'
// import { Request } from 'express'
// import { ExtractJwt, Strategy } from 'passport-jwt'
// import { JwtPayload } from './jwt.payload'

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @Inject(CACHE_MANAGER)
//     private readonly cacheManager: Cache,
//     private readonly userService: UserService
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: process.env.JWT_SECRET,
//       passReqToCallback: true
//     })
//   }

//   async validate(req: Request, payload: JwtPayload): Promise<JwtPayload> {
//     const { id, email } = payload
//     try {
//       // Set access token from header Authorization
//       payload.accessToken = req.headers.authorization.split(' ')[1]
//       // Then check it in redis cache
//       const redisData = await this.cacheManager.get(payload.accessToken)
//       // If it exists means that token is unexpired but user still log out then block request with that token
//       if (redisData) {
//         throw new UnauthorizedException()
//       }
//       // Else
//       const user = await this.userService.searchUserByCondition({
//         where: { id: id, email: email }
//       })

//       if (!user) {
//         throw new UnauthorizedException()
//       }
//     } catch (error) {
//       Logger.error(error.message)
//       throw new UnauthorizedException(error.message)
//     }
//     // Finally
//     return payload
//   }
// }
