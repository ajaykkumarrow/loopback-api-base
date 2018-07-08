const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const factory = require('../factory.js');
const UserService = require('../../server/services/user_service.js');
const ErrorConstants = require('../../server/utils/constants/error_constants');

describe('UserService', () => {
  describe('createUser', () => {
    it('create a new user based on unique inputs', async() => {
      const user = await factory.build('User', { mobile_no: '9876543210', email: 'user1@gmail.com'});
      const userService = new UserService();
      userService.createUser(user, (err,result) => {
        assert.equal(result.user.mobile_no, user.mobile_no, 'user created');
      });
    });
  });
  describe('login', () => {
    it('successfull user login', async() => {
      const user = await factory.create('User', { mobile_no: '9876543211', email: 'user2@gmail.com'});
      const userService = new UserService();
      userService.login({email: 'user2@gmail.com', password:'test1234'}, (err,result) => {
        assert.equal(result.user.mobile_no, user.mobile_no, 'login successfull');
      });
    });
  });

})
