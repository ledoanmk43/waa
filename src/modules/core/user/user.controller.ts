import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common'
import { UserService } from './services'
import { TCustomRequest } from '@core/auth/types'
import { User } from './entities'
import { JwtAccessGuard } from '@core/auth/guards'
import { ApiBearerAuth } from '@nestjs/swagger'
import { ForgotPasswordDto } from './dtos'

@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAccessGuard)
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getUserById(@Req() { user }: TCustomRequest): Promise<User> {
    return this._userService.searchUserById(user.id)
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    return this._userService.sendEmailResetUserPassword(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-new-password')
  compareAndChangePassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    return this._userService.sendEmailResetUserPassword(dto)
  }
}
