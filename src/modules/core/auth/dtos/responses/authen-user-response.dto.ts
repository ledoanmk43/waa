import { ApiProperty } from '@nestjs/swagger'

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  refreshToken?: string
}

export class SendEmailResetPwResponseDto {
  message: string
}

export class ValidRedisDTO {
  isValid: boolean
}
