import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { JwtAccessGuard, JwtRefreshGuard } from './guards'
import { AuthService } from './auth.service'
import { AuthResponseDto, RedisTokenDto, SignInDto, SignOutDto, SignUpDto } from './dtos'
import { TCustomRequest } from './types'

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto): Promise<AuthResponseDto> {
    return await this.authService.signUpUser(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() dto: SignInDto): Promise<AuthResponseDto> {
    return await this.authService.signInUser(dto)
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  async refreshToken(@Req() { user }: TCustomRequest): Promise<AuthResponseDto> {
    return await this.authService.refreshToken(user)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAccessGuard)
  @Post('sign-out')
  async signOut(
    @Req() { user }: TCustomRequest,
    @Body() { refreshToken }: SignOutDto
  ): Promise<void> {
    await this.authService.signOutUser(user.accessToken, refreshToken)
  }

  @HttpCode(HttpStatus.OK)
  @Post('redis-session-expiration')
  async checkIsValidSessionToken(@Body() { tokenId }: RedisTokenDto): Promise<string> {
    const isValidToken = await this.authService.checkIsValidSessionToken(tokenId)

    return isValidToken ? tokenId : ''
  }
}
