import { Expose } from 'class-transformer'

export class AuthResponseDto {
  @Expose()
  accessToken: string

  @Expose()
  refreshToken: string

  idToken?: string
}

export class SendEmailResetPwResponseDto {
  @Expose()
  message: string
}

export class ValidRedisDTO {
  @Expose()
  isValid: boolean
}
