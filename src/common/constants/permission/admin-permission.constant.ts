import { UserPermission } from './user-permission.constant'

export const AdminPermission = Object.freeze({
  ...UserPermission,
  GET_ALL_USER: 'GET_ALL_USER',
  DISABLE_USER: 'DISABLE_USER'
})
