const XlsxUtils = require('../utils/xlsx_utils');
const loopback = require('../../server/server');

const app = loopback.dataSources.postgres.models;

module.exports = class BaseImporter {
  constructor(filePath, mappingJson) {
    this.filePath = filePath;
    this.sheetName = mappingJson.sheetName;
    this.mappings = mappingJson.columns;
    this.model = mappingJson.model;
    this.statergy = mappingJson.Statergy;
    this.statergyParam = mappingJson.QueryParams;
    this.relationMapping = mappingJson.relations;
    this.errorRows = [];
  }

  registerChild(child) {
    this.child = child;
  }

  async import(callback) {
    try {
      this.items = await XlsxUtils.sheetToJSON(this.getAbsolutePath(), this.sheetName);
      this.preparedItems = await this.prepareToImport();
      this.importItems(callback);
    } catch (err) {
      callback(err);
    }
  }

  prepareToImport() {
    return new Promise(async (resolve, reject) => {
      try {
        const preparedItems = [];
        await Promise.all(this.items.map(async (item) => {
          const keys = Object.keys(this.mappings);
          const preparedItem = await this.processKeys(item, keys);
          preparedItems.push(preparedItem);
        }));
        resolve(preparedItems);
      } catch (e) {
        reject(e);
      }
    });
  }

  async processKeys(item, keys) {
    return new Promise((async (resolve) => {
      const preparedItem = {};
      for (let i = 0; i < keys.length; i += 1) {
        const columnName = this.mappings[keys[i]].property;
        const value = item[keys[i]];
        if (value) {
          preparedItem[columnName] = value;
          const relation = this.relationMapping[columnName];
          if (relation) {
            const relationId = await this.findRelations(relation, preparedItem);
            preparedItem[columnName] = relationId && relationId;
          }
        } else if (this.mappings[keys[i]].defaultValue) {
          preparedItem[columnName] = this.mappings[keys[i]].defaultValue;
        }
      }
      return resolve(preparedItem);
    }));
  }

  async importItems(callback) {
    await Promise.all(this.preparedItems.map(async (preparedItem) => {
      if (this.child) {
        this.child.importRow(preparedItem);
      } else {
        switch (this.statergy) {
          case 'upsertwithwhere':
            await this.upsertWithWhereToModel(preparedItem, this.model);
            break;
          default:
            await this.importToModel(preparedItem, this.model);
        }
      }
    }));
    callback(null, 'Done');
  }

  upsertWithWhereToModel(preparedItem, modelName) {
    const newObject = preparedItem;
    return new Promise((resolve) => {
      const queryParam = {};
      queryParam.id = preparedItem[this.statergyParam];
      app[modelName].upsertWithWhere(queryParam, newObject, (err, data) => {
        if (err) {
          const newData = newObject;
          newData.msg = err;
          this.errorRows.push(newObject);
          resolve();
          return;
        }
        resolve(data);
      });
    });
  }

  importToModel(preparedItem, modelName) {
    const newObject = preparedItem;
    return new Promise((resolve) => {
      app[modelName].create(newObject, (err, data) => {
        if (err) {
          const newData = newObject;
          newData.msg = err;
          this.errorRows.push(newObject);
          resolve();
          return;
        }
        resolve(data);
      });
    });
  }

  getAbsolutePath() {
    return process.cwd() + this.filePath;
  }

  static findOrCreateByName(modelName, name) {
    return new Promise(((resolve, reject) => {
      app[modelName].findOrCreate({ where: { name } }, { name }, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    }));
  }

  async findRelations(relation, currentObj) {
    let result = null;
    return new Promise((async (resolve) => {
      if (relation.queryDependencies) {
        result = await this.findRelationId(currentObj, relation);
      }
      return resolve(result);
    }));
  }

  async findRelationId(currentObj, relation) {
    this.x = relation;
    return new Promise(async (resolve, reject) => {
      let relationObj = null;
      try {
        const query = { where: {} };
        relation.queryDependencies.forEach((dependency) => {
          const queryValue = currentObj[dependency.objectProperty];
          if (queryValue) {
            query.where[dependency.queryProperty] = queryValue;
          }
        });
        relationObj = await app[relation.model].findOne(query);
      } catch (e) {
        reject(e);
      }
      return resolve(relationObj.id);
    });
  }
};
