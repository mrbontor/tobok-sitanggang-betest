const ApplicationError = require('./applicationError');

class GeneralError extends ApplicationError {
    constructor(message, statusCode, errors) {
        super(message, false, statusCode, errors);
    }
}

module.exports = GeneralError;
