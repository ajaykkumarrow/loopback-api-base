const ERRORS = {
  USER: {
    INVALID: { message: 'Invalid User', status: 406 },
    NOT_EXIST: { message: 'User doesnot exist', status: 400 },
    EXIST: { message: 'User Exist', status: 400 },
    INVALID_PASSWORD: { message: 'Invalid Password', status: 406 },
    UNAUTHORIZED: { message: 'User not authorized', status: 401 },
    SAME_PASSWORD: { message: 'Old and New passwords are same', status: 406 },
    NOT_NEW: { message: 'Its not new User', status: 406 },
    SEND_CREDENTIALS_FAILED: { message: 'credentials failed to send', status: 406 },
    MANAGER_DELETE: { message: 'Manager cannot be deleted', status: 401 },
    USER_IS_MAPPED: { message: 'User has team members', status: 401 },
  },
  ROLE: {
    NOT_FOUND: { message: 'Role not found', status: 404 },
  },
  VALIDATION: {
    USER_NAME: { message: 'User name is required', status: 400 },
    MOBILE_NUMBER: { message: 'Mobile number is not valid', status: 400 },
    GENDER: { message: 'User gender is required', status: 400 },
  },
};

// export default constants;
Object.defineProperty(module.exports, '__esModule', {
  value: true,
});

module.exports = { ERRORS };
