import { BaseEntity } from '@common/base'
import { Exclude } from 'class-transformer'
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { Permission } from './permission.entity'
import { User } from './user.entity'

@Entity('roles')
export class Role extends BaseEntity {
  constructor(partial: Partial<Role>) {
    super()
    Object.assign(this, partial)
  }

  @Column({ name: 'NAME', unique: true, length: 255 })
  name: string

  @Column({ name: 'DEL_DT', nullable: true })
  @Exclude()
  deletedAt?: Date

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

  @ManyToMany(() => User, (user) => user.roles)
  users: User[]
}
