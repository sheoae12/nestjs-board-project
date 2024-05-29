export enum ResMessage {
  USER_NOT_FOUND = 'user not found',
  POST_NOT_FOUND = 'post not found',
  COMMENT_NOT_FOUND = 'comment not found',
  CATEGORY_NOT_FOUND = 'category not found',
  DB_ERROR = 'database error',
  SERVER_ERROR = 'server error',
  DUPLICATE_USER = 'email already exist',
  PASSWORD_MISMATCH = 'password mismatch',
  NOT_AUTHOR = 'no permission: not an author',
  CANNOT_USE_ROOT_CATEGORY = 'category must not be a root',
  CANNOT_DELETE_ROOT_CATEGORY = 'cannot delete parent category',
  CANNOT_DELETE_USING_CATEGORY = 'cannot delete in-use category',
}
