import { ApiProperty } from '@nestjs/swagger'

export class AuthResponse {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  refreshToken?: string
}

export class SendEmailResetPwResponse {
  message: string
}

export class ValidRedisResponse {
  isValid: boolean
}
