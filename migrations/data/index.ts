import { SystemPermission } from '@common/constants'
import { v4 as uuidv4 } from 'uuid'

// Root user's seeding data
export const SeedRootId = uuidv4() //root user id
export const SeedRootEmail = 'admin@admin.com' //root user email
export const SeedRootPassword = '$2b$10$haKo7cmMeVgATwwfEM9EAu.uRLKhbqhH8heg7XWlJ.XDqXNgyTJ9q' //root user password
export const SeedRootFirstName = 'Doan' //root user first name
export const SeedRootLastName = 'Le' //root user last name

// begin:MASTER role
export const SeedMasterRoleId = uuidv4()
export const MASTER_PERMISSION_ID: string = uuidv4()
// Actions:

// end:MASTER role

// begin:ADMIN role
export const SeedAdminRoleId: string = uuidv4()
export const ADMIN_PERMISSION_ID: string = uuidv4()
// Actions:

// end:ADMIN role

// begin:USER role
export const SeedUserRoleId: string = uuidv4()
export const USER_PERMISSION_ID: string = uuidv4()
// Actions:

// end:USER role

// Seed data for permissions table
// Map all system permissions to a Map object
export const MSystemPermission = Object.keys(SystemPermission).reduce(
  (map, key) =>
    map.set(key, {
      id: uuidv4(),
      description: SystemPermission[key]
    }),
  new Map()
)
