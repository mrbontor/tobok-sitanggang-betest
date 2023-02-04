const ApplicationError = require('./applicationError');

class NotFoundError extends ApplicationError {
    constructor(message) {
        super(message || 'Data Not Found!', false, 404);
    }
}

module.exports = NotFoundError;
