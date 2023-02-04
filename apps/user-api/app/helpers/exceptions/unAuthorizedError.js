const ApplicationError = require('./applicationError');

class UnAuthorizedError extends ApplicationError {
    constructor(message) {
        super(message || 'Un Authorized!', false, 401);
    }
}

module.exports = UnAuthorizedError;
