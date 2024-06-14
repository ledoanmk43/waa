import { SystemPermission } from '@common/constants'
import {
  MSystemPermission,
  SeedAdminRoleId,
  SeedMasterRoleId,
  SeedRootEmail,
  SeedRootFirstName,
  SeedRootId,
  SeedRootLastName,
  SeedRootPassword,
  SeedUserRoleId
} from 'migrations/data'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class SeedingUserRolePermissionTable1718173230506 implements MigrationInterface {
  name = 'SeedingUserRolePermissionTable1718173230506'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Seeding the root user
    await queryRunner.query(`INSERT INTO users(
      id, "CRE_DT", "UPD_DT", "CRE_BY", "UPD_BY", "EMAIL", "PASSWORD", "FIRSTNAME", "LASTNAME", "IS_PENDING")
      VALUES ('${SeedRootId}', now(), now(), '${SeedRootId}', '${SeedRootId}',  '${SeedRootEmail}', '${SeedRootPassword}', '${SeedRootFirstName}', '${SeedRootLastName}', false);`)

    // Seeding the roles table
    await queryRunner.query(
      `INSERT INTO roles (id, "NAME", "CRE_BY", "UPD_BY")
                    VALUES ('${SeedMasterRoleId}', 'MASTER', '${SeedRootId}', '${SeedRootId}'),
                    ('${SeedAdminRoleId}', 'ADMIN', '${SeedRootId}', '${SeedRootId}'),
                    ('${SeedUserRoleId}', 'USER', '${SeedRootId}', '${SeedRootId}');`
    )

    await queryRunner.query(
      `INSERT INTO user_roles (user_id, role_id)
                  VALUES ('${SeedRootId}', '${SeedMasterRoleId}');`
    )

    // Seeding the permissions table
    // Create an object to store the id of the two permissions
    const permissionIds = {
      [SystemPermission.GET_ALL_PERMISSIONS]: '',
      [SystemPermission.UPDATE_PERMISSION_ROLE]: ''
    }

    // Create a string of values to be inserted into the permissions table mapped from the MSystemPermission object
    const permissionValuesString = Array.from(MSystemPermission)
      .map(([key, value]) => {
        // Save the id of the two permissions
        if (
          key === SystemPermission.GET_ALL_PERMISSIONS ||
          key === SystemPermission.UPDATE_PERMISSION_ROLE
        )
          permissionIds[key] = value.id

        return `('${value.id}', '${key}', 'This permission is to ${value.description}', '${SeedRootId}', '${SeedRootId}')`
      })
      .join(', ')

    await queryRunner.query(
      `INSERT INTO permissions (id, "NAME", "DESCRIPTION", "CRE_BY", "UPD_BY")
                  VALUES ${permissionValuesString};`
    )

    await queryRunner.query(
      `INSERT INTO role_permissions (role_id, permission_id)
                VALUES ('${SeedMasterRoleId}', '${permissionIds[SystemPermission.GET_ALL_PERMISSIONS]}'), 
                ('${SeedMasterRoleId}', '${permissionIds[SystemPermission.UPDATE_PERMISSION_ROLE]}');`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete the root user
    await queryRunner.query(`DELETE FROM users WHERE "EMAIL" = '${SeedRootEmail}';`)

    // Delete the roles table
    await queryRunner.query(`DELETE FROM roles WHERE id IS NOT NULL;`)
    await queryRunner.query(`DELETE FROM user_roles WHERE user_id IS NOT NULL;`)

    // Delete the permissions table
    await queryRunner.query(`DELETE FROM permissions WHERE id IS NOT NULL;`)
    await queryRunner.query(`DELETE FROM role_permissions WHERE role_id IS NOT NULL;`)
  }
}
