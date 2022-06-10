module.exports = {
  BaseError: class {
    constructor(message, code, note) {
      this.message = message;
      this.code = code;
      this.note = note;
    }
	
    /**
		 * @returns {JSON<BaseError>} JSON object with error information
		 */
    generateJSON() {
      return JSON.parse(`{
				"error": true,
				"message": "${this.message}",
				"note": "${this.note}"
			}`);
    }
  }
};