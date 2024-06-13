import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Permission, Role, User } from './entities'
import { UserController } from './user.controller'
import { UserService } from './services/user.service'
import { UserRepository } from './repositories/user.repository'
import { PermissionService, RoleService } from './services'
import { RoleRepository, PermissionRepository } from './repositories'

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  controllers: [UserController],
  providers: [
    UserService,
    RoleService,
    PermissionService,
    UserRepository,
    RoleRepository,
    PermissionRepository
  ],
  exports: [UserService, RoleService, UserRepository, RoleRepository]
})
export class UserModule {}
