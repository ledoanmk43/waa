export enum ECommonErrorMessage {
  FORBIDDEN = 'Forbidden',
  FAIL_TO_CREATE = 'Fail to create',
  FAIL_TO_UPDATE = 'Fail to update',
  FAIL_TO_DELETE = 'Fail to delete',
  TOKEN_EXPIRED = 'Token expired'
}

export enum EUserMessage {
  NOT_FOUND = 'User not found',
  INVALID_EMAIL = 'Invalid email',
  INVALID_USERNAME_OR_PASSWORD = 'Invalid username or password',
  INVALID_USER_ID = 'Invalid user id',
  INVALID_USER_PASSWORD = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.',
  INVALID_USER_EMAIL = 'Invalid user email',
  INVALID_USER_FIRST_NAME = 'Invalid user first name',
  INVALID_USER_LAST_NAME = 'Invalid user last name',
  INVALID_USER_PHONE_NUMBER = 'Invalid user phone number',
  INVALID_USER_BIRTH_DATE = 'Invalid user birth date',
  ALREADY_EXISTS_EMAIL = 'Email already exists',
  ALREADY_EXISTS_USERNAME = 'Username already exists',
  WRONG_USERNAME = 'Wrong username',
  WRONG_PASSWORD = 'Wrong password'
}

export enum ERoleMessage {
  NOT_FOUND = 'Role not found',
  ALREADY_EXISTS = 'Role already exists',
  INVALID_ROLE_ID = 'Invalid role id',
  INVALID_ROLE = 'Invalid role',
  INVALID_ROLE_NAME = 'Invalid role name',
  INVALID_ROLE_DESCRIPTION = 'Invalid role description'
}
