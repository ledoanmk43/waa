import { ConfigService } from '@infra/config/config.service'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { GoogleOauthGuard, JwtAccessGuard, JwtRefreshGuard } from './guards'
import { AuthService } from './auth.service'
import { AuthResponse, RedisTokenDto, SignInDto, SignOutDto, SignUpDto } from './dtos'
import { TCustomOAuthRequest, TCustomRequest } from './types'

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly _configService: ConfigService
  ) {}

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: TCustomOAuthRequest, @Res() res) {
    const googleResponse = await this.authService.googleLogin(req.user)
    if (googleResponse) {
      res.redirect(this._configService.get('GOOGLE_REDIRECT_URL') + googleResponse.accessToken)
    } else {
      res.redirect('http://localhost:3000/login')
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto): Promise<AuthResponse> {
    return await this.authService.signUpUser(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() dto: SignInDto): Promise<AuthResponse> {
    return await this.authService.signInUser(dto)
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  async refreshToken(@Req() { user }: TCustomRequest): Promise<AuthResponse> {
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
