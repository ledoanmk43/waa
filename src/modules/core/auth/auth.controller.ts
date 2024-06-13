import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { JwtAuthenticationGuard } from './guards'
import { AuthService } from './auth.service'
import { AuthResponseDto, RedisTokenDto, SignInDto, SignUpDto } from './dtos'
import { AuthReq } from './types'
import { ConfigService } from '@nestjs/config'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  //   @UseGuards(GoogleOauthGuard)
  //   @Get('google')
  //   async googleAuth() {}

  //   @Get('google-redirect')
  //   @UseGuards(GoogleOauthGuard)
  //   async googleAuthRedirect(@Req() req: OAuthReq, @Res() res: any) {
  //     const data = await this.authService.googleLogin(req.user)
  //     if (data) {
  //       res.redirect(this.configService.get(GOOGLE_REDIRECT_URL) + data.accessToken)
  //     } else {
  //       res.redirect('http://localhost:3000/login')
  //     }
  //   }

  @Post('redis-session-expiration')
  async checkIsValidSessionToken(@Body() { tokenId }: RedisTokenDto): Promise<string> {
    const isValidToken = await this.authService.checkIsValidSessionToken(tokenId)

    return isValidToken ? tokenId : ''
  }

  @Post('sign-up')
  register(@Body() body: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.registerUser(body)
  }

  @Post('sign-in')
  login(@Body() body: SignInDto, @Req() request: Request): Promise<AuthResponseDto> {
    console.log(request)
    return this.authService.loginUser(body)
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('sign-out')
  async getUserLogout(@Req() request: AuthReq) {
    await this.authService.addAccessTokenBlackList(request.user.accessToken, request.user.id)
  }
}
