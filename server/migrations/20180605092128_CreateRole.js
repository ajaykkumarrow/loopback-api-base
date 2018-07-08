"use strict";

const server = require('../server');
const postgres_ds = server.dataSources.postgres;

const defaultRoles = [
  {
    name: 'SUPER_USER',
    description: 'Role assigned to a super user'
  },
  {
    name: 'USER',
    description: 'Role assigned to a user'
  }
];

/**
 * @author Ajaykkumar Rajendran
 */
class CreateRoleMigration {
  change() {
    // To create set of default roles and persist it into database
    server.models.Roles.create(defaultRoles, (err, roles) => {
      if (err)
        throw err;
    });
  }
}

let objCreateRole = new CreateRoleMigration();
objCreateRole.change();
