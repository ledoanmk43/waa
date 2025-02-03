import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export * from './forgot-password.dto'

export class GetContactDto {
  @ApiProperty()
  @IsString()
  countryCd: string

  @ApiProperty()
  @IsString()
  officeCode: string

  @ApiProperty()
  @IsString()
  service: string

  @ApiProperty()
  @IsString()
  eventId1: string

  @ApiProperty()
  @IsString()
  eventId2: string

  @ApiProperty()
  @IsString()
  eventId3: string

  @ApiProperty()
  @IsString()
  triggerPoint: string
}
