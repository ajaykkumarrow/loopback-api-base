// import statements
const AppError = require('../error/app_error');

/**
 * @author Ajaykkumar Rajendran
 */
module.exports = class AuditUtils {
  /**
   * Gets the city based on the Ip location
   * @param  {String}   modelName                  model instance's name
   * @param  {Object}   ctx       database context of the model instance
   * @param  {Function} callback                                callback
   * @author Ajaykkumar Rajendran
   */
  persistInstanceUpdatedAt(modelName, ctx, callback) {
    this.modelName = modelName;
    try {
      if (!ctx.isNewInstance) {
        ctx.currentInstance.updated_at = new Date();
        return callback(null, ctx.currentInstance);
      }
      return callback(null, ctx.instance);
    } catch (error) {
      return callback(new AppError(error));
    }
  }
};
