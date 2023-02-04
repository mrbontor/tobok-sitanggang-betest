const ApplicationError = require('./applicationError');

class ServerError extends ApplicationError {
    constructor(message) {
        super(message || 'Internal Server Error!', false, 500);
    }
}

module.exports = ServerError;
