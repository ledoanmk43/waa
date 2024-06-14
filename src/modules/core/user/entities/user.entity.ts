import { BaseEntity } from '@common/base'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import * as bcrypt from 'bcrypt'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { Role } from './role.entity'

@Entity('users')
export class User extends BaseEntity {
  constructor(partial: Partial<User>) {
    super()
    Object.assign(this, partial)
  }

  @ApiProperty()
  @Column({ name: 'EMAIL', unique: true, length: 255 })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @Column({ name: 'PASSWORD', length: 255 })
  @IsNotEmpty()
  @Exclude()
  password: string

  @ApiProperty()
  @Column({ name: 'IS_PENDING', type: 'boolean', default: true })
  isPending?: boolean

  @ApiProperty()
  @Column({ name: 'IS_DISABLE', type: 'boolean', default: false })
  isDisable?: boolean

  @ApiProperty()
  @Column({ name: 'FIRSTNAME', length: 255 })
  firstName: string

  @ApiProperty()
  @Column({ name: 'LASTNAME', length: 255 })
  lastName: string

  @ApiProperty()
  @Column({ name: 'GLOBAL_ID', nullable: true })
  globalId?: string

  @ApiProperty()
  @Column({ name: 'OFFICE_CODE', nullable: true })
  officeCode?: string

  @ApiProperty()
  @Column({ name: 'COUNTRY', nullable: true })
  country?: string

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: true,
    eager: true
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id'
    }
  })
  roles: Role[]

  @BeforeInsert()
  setCreateUpdateBy() {
    this.createdBy = this.id
    this.updatedBy = this.id
  }

  @BeforeUpdate()
  setUpdateBy() {
    this.updatedBy = this.id
  }

  @BeforeUpdate()
  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
  }

  @BeforeInsert()
  setAccountState() {
    this.isDisable = false
    this.isPending = true
  }
}
