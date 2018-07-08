const logger = require('winston');

const BaseImporter = require('../importers/base_importer.js');
const DealerImporter = require('../importers/dealer_importer');
const zonesMappingJson = require('../../server/importers/mappings/zones.json');
const statesMappingJson = require('../../server/importers/mappings/states.json');
const citiesMappingJson = require('../../server/importers/mappings/cities.json');
const vehiclesMappingJson = require('../../server/importers/mappings/vehicles.json');
const variantsMappingJson = require('../../server/importers/mappings/variants.json');
const variantColorsMappingJson = require('../../server/importers/mappings/variant-colors.json');
const accessoriesMappingJson = require('../../server/importers/mappings/accessories.json');
const dealerCategoriesMappingJson = require('../../server/importers/mappings/dealer-categories.json');
const dealersMappingJson = require('../../server/importers/mappings/dealers.json');
const dealerManagersMappingJson = require('../../server/importers/mappings/dealer-managers.json');
const manufacturerMappingJson = require('../../server/importers/mappings/manufacturers.json');
const manufacturerUsersMappingJson = require('../../server/importers/mappings/manufacturer-users.json');
const financierMappingJson = require('../../server/importers/mappings/financiers.json');
const vehiclePriceMappingJson = require('../../server/importers/mappings/vehicle-price.json');
const galleryMappingJson = require('../../server/importers/mappings/galleries.json');
const vehicleFeaturesMappingJson = require('../../server/importers/mappings/vehicle-features.json');

const filePath = '/server/importers/data/suzuki_dealers.xlsx';

/**
 * @author Ajaykkumar Rajendran
 */
class SuzukiManufaturer {
  static async importData() {
    try {
      await SuzukiManufaturer.importByMappingJson(manufacturerMappingJson);
      await SuzukiManufaturer.importManufacturerUserByMappingJson(manufacturerUsersMappingJson);
      await SuzukiManufaturer.importByMappingJson(zonesMappingJson);
      await SuzukiManufaturer.importByMappingJson(statesMappingJson);
      await SuzukiManufaturer.importByMappingJson(citiesMappingJson);
      await SuzukiManufaturer.importByMappingJson(vehiclesMappingJson);
      await SuzukiManufaturer.importByMappingJson(variantsMappingJson);
      await SuzukiManufaturer.importByMappingJson(variantColorsMappingJson);
      await SuzukiManufaturer.importByMappingJson(accessoriesMappingJson);
      await SuzukiManufaturer.importByMappingJson(dealerCategoriesMappingJson);
      await SuzukiManufaturer.importByMappingJson(dealersMappingJson);
      await SuzukiManufaturer.importByMappingJson(financierMappingJson);
      await SuzukiManufaturer.importByMappingJson(galleryMappingJson);
      await SuzukiManufaturer.importDealerByMappingJson(dealerManagersMappingJson);
      await SuzukiManufaturer.importByMappingJson(vehiclePriceMappingJson);
      await SuzukiManufaturer.importByMappingJson(vehicleFeaturesMappingJson);
    } catch (e) {
      logger.error(e);
    }
  }

  static importByMappingJson(mappingJson) {
    return new Promise((resolve, reject) => {
      const baseImporter = new BaseImporter(filePath, mappingJson);
      baseImporter.import((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  static importDealerByMappingJson(mappingJson) {
    return new Promise((resolve, reject) => {
      const dealerImporter = new DealerImporter(filePath, mappingJson, 'DEALER_MANAGER');
      dealerImporter.import((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  static importManufacturerUserByMappingJson(mappingJson) {
    return new Promise((resolve, reject) => {
      const dealerImporter = new DealerImporter(filePath, mappingJson, 'MANUFACTURER');
      dealerImporter.import((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}

SuzukiManufaturer.importData();
