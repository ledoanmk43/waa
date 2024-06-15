import { Controller, Get, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserService } from './services'
import { TCustomRequest } from '@core/auth/types'
import { User } from './entities'
import { JwtAccessGuard } from '@core/auth/guards'

@Controller('user')
@UseGuards(JwtAccessGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get('profile')
  getUserById(@Req() { user }: TCustomRequest): Promise<User> {
    return this._userService.searchUserById(user.id)
  }
}
