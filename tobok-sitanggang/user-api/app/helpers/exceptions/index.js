const ApplicationError = require('./applicationError');
const BadRequestError = require('./badRequestError');
const ValidationError = require('./validationError');
const UnprocessableEntityError = require('./unProcessableEntityError');
const NotFoundError = require('./notFoundError');
const NotAuthorizedError = require('./unAuthorizedError');
const ForbiddenError = require('./forbiddenError');
const GeneralError = require('./generalError');
const ServerError = require('./serverError');

module.exports = {
    ApplicationError,
    BadRequestError,
    NotFoundError,
    ValidationError,
    UnprocessableEntityError,
    ServerError,
    NotAuthorizedError,
    ForbiddenError,
    GeneralError
};
