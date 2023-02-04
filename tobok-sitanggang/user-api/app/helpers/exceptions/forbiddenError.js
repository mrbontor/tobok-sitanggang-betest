const ApplicationError = require('./applicationError');

class ForbiddenError extends ApplicationError {
    constructor(message) {
        super(message || 'Access Forbidden!', false, 403);
    }
}

module.exports = ForbiddenError;
