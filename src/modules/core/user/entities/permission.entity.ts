import { BaseEntity } from '@common/base'
import { Exclude } from 'class-transformer'
import { IsUppercase } from 'class-validator'
import { Column, Entity, ManyToMany } from 'typeorm'
import { Role } from './role.entity'

@Entity('permissions')
export class Permission extends BaseEntity {
  constructor(partial: Partial<Permission>) {
    super()
    Object.assign(this, partial)
  }

  @Column({ name: 'NAME', unique: true, length: 255 })
  @IsUppercase()
  name: string

  @Column({ name: 'DESCRIPTION', length: 255 })
  description: string

  @Column({ name: 'DEL_DT', nullable: true })
  @Exclude()
  deletedAt?: Date

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[]
}
