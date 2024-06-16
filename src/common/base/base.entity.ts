import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

export abstract class BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string = uuidv4()

  @ApiProperty()
  @CreateDateColumn({ name: 'CRE_DT', default: () => 'CURRENT_TIMESTAMP' })
  createdDate?: Date

  @ApiProperty()
  @UpdateDateColumn({ name: 'UPD_DT', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedDate?: Date

  @ApiProperty()
  @Column({ name: 'CRE_BY' })
  createdBy?: string

  @ApiProperty()
  @Column({ name: 'UPD_BY' })
  updatedBy?: string
}
