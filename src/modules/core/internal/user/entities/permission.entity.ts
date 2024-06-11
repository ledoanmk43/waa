import { BaseEntity } from '@common/base'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { Column, Entity, ManyToMany } from 'typeorm'
import { IsUppercase } from 'class-validator'
import { Role } from './role.entity'

@Entity('permissions')
export class Permission extends BaseEntity {
  constructor(partial: Partial<Permission>) {
    super()
    Object.assign(this, partial)
  }

  @ApiProperty()
  @Column({ name: 'NAME', unique: true, length: 255 })
  @Expose()
  @IsUppercase()
  name: string

  @ApiProperty()
  @Column({ name: 'DESCRIPTION', length: 255 })
  @Expose()
  description: string

  @ApiProperty()
  @Column({ name: 'DEL_DT', nullable: true })
  deletedAt?: Date

  @ApiProperty()
  @Expose()
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[]
}
