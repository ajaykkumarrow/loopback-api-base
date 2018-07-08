const AuditUtil = require('../utils/audit-utils');
const UserService = require('../services/user_service');

module.exports = (User) => {
  const user = User;

  /**
   * Updates the log field values
   * @param  {Object}   ctx       database context of the model instance
   * @param  {Function} callback                                callback
   * @author Ajaykkumar Rajendran
   */
  user.observe('before save', (ctx, next) => {
    const auditUtil = new AuditUtil();
    auditUtil.persistInstanceUpdatedAt('User', ctx, next);
  });

  user.remoteMethod('register', {
    http: { path: '/register', verb: 'post' },
    accepts: { arg: 'newUser', type: 'Users', http: { source: 'body' } },
    returns: { arg: 'user', type: 'UserAccessToken', root: true },
  });

  /**
   * [registerr description]
   * @param  {[type]}   newUser  [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  user.register = (newUser, callback) => {
    const userService = new UserService();
    userService.createUser(newUser, callback);
  };

  user.remoteMethod('loginUser', {
    http: { path: '/login', verb: 'post' },
    accepts: { arg: 'credentials', type: 'Login', http: { source: 'body' } },
    returns: { arg: 'user', type: 'UserAccessToken', root: true },
  });

  user.loginUser = (credentials, callback) => {
    const userService = new UserService();
    userService.login(credentials, callback);
  };
};
