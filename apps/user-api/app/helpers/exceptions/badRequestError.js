const ApplicationError = require('./applicationError');

class BadRequestError extends ApplicationError {
    constructor(message) {
        super(message || 'Invalid Request!', false, 400);
    }
}

module.exports = BadRequestError;
