import { AdminPermission } from './admin-permission.constant'

export const SystemPermission = Object.freeze({
  ...AdminPermission,
  GET_ALL_PERMISSIONS: 'GET_ALL_PERMISSIONS',
  UPDATE_PERMISSION_ROLE: 'UPDATE_PERMISSION_ROLE',
  DELETE_USER: 'DELETE_USER'
})
