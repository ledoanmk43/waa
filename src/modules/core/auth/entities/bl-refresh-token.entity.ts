import { BaseEntity } from '@common/base'
import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity } from 'typeorm'
import { IsUppercase } from 'class-validator'

@Entity('bl_refresh_tokens')
export class BlacklistRefreshToken extends BaseEntity {
  constructor(partial: Partial<BlacklistRefreshToken>) {
    super()
    Object.assign(this, partial)
  }

  @ApiProperty()
  @Column({ name: 'TOKEN', unique: true })
  @IsUppercase()
  token: string

  @ApiProperty()
  @Column({ name: 'EXP_DT' })
  expireDate: Date
}
