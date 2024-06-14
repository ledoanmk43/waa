import { BaseEntity } from '@common/base'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { User } from './user.entity'
import { Permission } from './permission.entity'

@Entity('roles')
export class Role extends BaseEntity {
  constructor(partial: Partial<Role>) {
    super()
    Object.assign(this, partial)
  }

  @ApiProperty()
  @Column({ name: 'NAME', unique: true, length: 255 })
  name: string

  @ApiProperty()
  @Column({ name: 'DEL_DT', nullable: true })
  @Exclude()
  deletedAt?: Date

  @ApiProperty()
  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id'
    }
  })
  permissions: Permission[]

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.roles)
  users: User[]
}
