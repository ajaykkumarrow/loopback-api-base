// import statements
const BaseService = require('../services/base_service');
const loopback = require('../server.js');
const AppError = require('../error/app_error');
const ErrorConstants = require('../utils/constants/error_constants');
const constants = require('../utils/constants/appConstants');

const app = loopback.dataSources.postgres.models;

/**
 * @author Ajaykkumar Rajendran
 */
module.exports = class UserService extends BaseService {
  constructor(id, user) {
    super();
    this.id = id;
    this.user = user;
  }

  /**
   * [createUser description]
   * @param  {[type]}   newUser  [description]
   * @param  {Function} callback [description]
   * @return {Promise}           [description]
   * @author Ajaykkumar Rajendran
   */
  async createUser(newUser, callback) {
    this.newUser = newUser;
    try {
      const ifExist = await app.Users.findOne({
        where: {
          and: [
            { mobile_no: this.newUser.mobile_no }, { name: this.newUser.name },
          ],
        },
      });
      if (ifExist) {
        return callback(new AppError(ErrorConstants.ERRORS.USER.EXIST));
      }
      // todo for password creation
      this.newUser.password = this.newUser.mobile_no;
      const user = await this.createUserWithRole(constants.USER_ROLE_NAMES.USER, this.newUser);
      const accessToken = await app.AccessToken.create({ userId: user.id });
      return callback(null, { user, accessToken });
    } catch (error) {
      return callback(new AppError(error));
    }
  }

  /**
   * [login description]
   * @param  {[type]}   credentials [description]
   * @param  {Function} callback    [description]
   * @return {Promise}              [description]
   */
  async login(credentials, callback) {
    try {
      this.user = await app.Users.findOne({
        where: { email: credentials.email, is_active: true },
        include: {
          relation: 'user_role',
          scope: {
            fields: ['role_id'],
            include: { relation: 'role', scope: { fields: ['name'] } },
          },
        },
      });
      if (!this.user) {
        return callback(new AppError(ErrorConstants.ERRORS.USER.INVALID));
      }
      const isMatch = await this.user.hasPassword(credentials.password);
      if (!isMatch) {
        return callback(new AppError(ErrorConstants.ERRORS.USER.INVALID_PASSWORD));
      }
      const accessToken = await app.AccessToken.create({ userId: this.user.id });
      return callback(null, { accessToken, user: this.user });
    } catch (error) {
      return callback(new AppError(error));
    }
  }
};
