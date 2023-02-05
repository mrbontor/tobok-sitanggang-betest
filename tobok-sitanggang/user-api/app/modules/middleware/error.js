const ResponseHelper = require('../../helpers/response');
const { ValidationError } = require('../../helpers/exceptions');

/**
 *
 * @param {string} err
 * @param {*} req
 * @param {*} res
 */
module.exports = (err, req, res) => {
    let response = {
        status: err.status || 400,
        message: err.message
    };

    if (err instanceof ValidationError) {
        response.errors = err.errors.errors;
    }

    ResponseHelper.error(response, err);
};
