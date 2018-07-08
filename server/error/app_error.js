/**
 * @author Ajaykkumar Rajendran
 */
module.exports = class AppError extends Error {
  constructor(error) {
    super(error.message, error.status);
    this.name = this.constructor.name;
    this.status = error.status;
    Error.captureStackTrace(this, this.constructor);
  }
};
