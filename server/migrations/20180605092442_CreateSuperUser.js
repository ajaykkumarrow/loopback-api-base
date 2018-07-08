"use strict";

const server = require('../server');
const postgres_ds = server.dataSources.postgres;
const userObj = {
  "name": 'superuser',
  "email": 'superuser@gmail.com',
  "mobile_no": '1234567890',
  "password": 'test1234'
};
/**
 * @author Ajaykkumar Rajendran
 */
class CreateSuperUserMigration {
  async change() {
  try {
    const role = await server.models.Roles.findOne({where: {name: 'SUPER_USER'}});
    const user = await server.models.Users.create(userObj);
    await server.models.UserRole.create({
      user_id: user.id,
      role_id: role.id,
      principalType: 'USER',
      principalId: user.id,
    });
  } catch (err) {
    throw err;
  }
}
}

let objCreateSuperUser = new CreateSuperUserMigration();
objCreateSuperUser.change();
