const loopback1 = require('../server.js');
const AppError = require('../error/app_error');
const ErrorConstants = require('../utils/constants/error_constants');

const app = loopback1.dataSources.postgres.models;
/**
 * @author Ajaykkumar Rajendran
 */
module.exports = class BaseService {
  constructor(currentUser) {
    this.currentUser = currentUser;
  }

  registerChild(child) {
    this.child = child;
  }

  /**
   * To persist a new user and associate with corresponding role
   * by finding id of the given role by name, and creating a new user if
   * not exist and associate to the role.
   *
   * @param  {string}  roleName                role name to sign-up as
   * @param  {object}  newUser                   new user data to save
   * @return {object}  user                               users object
   * @author Ajaykkumar Rajendran
   */
  async createUserWithRole(roleName, newUser) {
    this.roleName = roleName;
    this.newUser = newUser;
    try {
      this.role = await app.Roles.findOne({ where: { name: this.roleName } });
      if (!this.role) {
        throw new AppError(ErrorConstants.ERRORS.ROLE.NOT_FOUND);
      }
      this.users = await app.Users.findOrCreate({
        where: {
          and: [
            { mobile_no: this.newUser.mobile_no }, { name: this.newUser.name },
          ],
        },
      }, this.newUser);
      await app.UserRole.findOrCreate(
        { where: { and: [{ user_id: this.users[0].id }, { role_id: this.role.id }] } },
        {
          user_id: this.users[0].id,
          role_id: this.role.id,
          principalType: 'USER',
          principalId: this.users[0].id,
        },
      );
      return this.users[0];
    } catch (error) {
      throw (new AppError(error));
    }
  }
};
