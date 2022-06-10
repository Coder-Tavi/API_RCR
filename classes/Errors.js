const { BaseError } = require("./BaseError.js");

module.exports = {
  ForbiddenError: class extends BaseError {
    /**
		 * Thrown when a resource is restricted
		 * @param {String} message Custom message
		 * @param {String} stack Stacktrace to the error
		 */
    constructor(message, stack) {
      super(message, 403, "You are not permitted to access this resource");
      this.stack = stack;
    }
  },
  NotFoundError: class extends BaseError {
    /**
		 * Thrown when a resource is not found
		 * @param {String} message Custom message
		 * @param {String} stack Stacktrace to the error
		 */
    constructor(message, stack) {
      super(message, 404, "The resource you are looking for could not be found");
      this.stack = stack;
    }
  }
};