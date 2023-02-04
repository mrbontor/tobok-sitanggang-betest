const ApplicationError = require('./applicationError');

class UnprocessableEntityError extends ApplicationError {
    constructor(message) {
        super(message || 'Data Not Found!', false, 422);
    }
}

module.exports = UnprocessableEntityError;
