import { Controller } from '@nestjs/common'
import { UserService } from './services'

@Controller('user')
export class UserController {
  constructor(private readonly _service: UserService) {}

  //   @UsePipes(new ValidationPipe({ transform: true }))
  //TODO: Implement user controller methods
}
