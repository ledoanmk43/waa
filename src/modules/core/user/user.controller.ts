import { Controller, Get, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserService } from './services'
import { TCustomRequest } from '@core/auth/types'
import { User } from './entities'
import { JwtAccessGuard } from '@core/auth/guards'

@Controller('user')
@UseGuards(JwtAccessGuard)
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('profile')
  getUserById(@Req() { user }: TCustomRequest): Promise<User> {
    return this._userService.searchUserById(user.id)
  }
}
