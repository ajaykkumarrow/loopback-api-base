

const BaseImporter = require('../importers/base_importer');
const loopback = require('../../server/server');

const app = loopback.dataSources.postgres.models;
// const loopback = require("../../server/server");
//
// const app = loopback.dataSources.postgres.models;

/**
 * @author Ajaykkumar Rajendran
 */
module.exports = class DealerImporter extends BaseImporter {
  /**
   * Gets the Mapping json to create the object with the xlsx file name and the sheet name
   *
   * @param  {JSON} mappingJson [description]
   * @return {this} current object
   */
  constructor(fileName, mappingJson, roleName) {
    super(fileName, mappingJson);
    this.roleName = roleName;
    this.registerChild(this);
  }

  /**
   * Import the delar object with given xlx file
   *
   * @param  {JSON}   dealer   The dealer object which converted from the xlsx file.
   * @param  {Function} callback
   */
  async importRow(importItem, callback) {
    this.importItem = importItem;
    try {
      const users = await app.Users.findOrCreate({
        where:
        { mobile_no: this.importItem.mobile_no },
      }, this.importItem);
      const role = await app.Roles.findOne({ where: { name: this.roleName } });
      await app.UserRole.findOrCreate({
        where:
        { and: [{ user_id: users[0].id }, { role_id: role.id }] },
      }, {
        user_id: users[0].id,
        role_id: role.id,
        principalType: 'USER',
        principalId: users[0].id,
      });
    } catch (err) {
      callback(err);
    }
  }
};
