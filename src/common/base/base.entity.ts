import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

export abstract class BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string = uuidv4()

  @ApiProperty()
  @CreateDateColumn({ name: 'CRE_DT' })
  createdDate?: Date

  @ApiProperty()
  @UpdateDateColumn({ name: 'UPD_DT' })
  updatedDate?: Date

  @ApiProperty()
  @Column({ name: 'CRE_BY', nullable: false, default: 'system' })
  createdBy?: string

  @ApiProperty()
  @Column({ name: 'UPD_BY', nullable: true, default: 'system' })
  updatedBy?: string

  @BeforeInsert()
  public setCreateDate(): void {
    this.createdDate = new Date()
  }

  @BeforeUpdate()
  public setUpdateDate(): void {
    this.updatedDate = new Date()
  }
}
