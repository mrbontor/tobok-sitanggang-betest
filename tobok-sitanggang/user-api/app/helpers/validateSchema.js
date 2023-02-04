const Ajv = require('ajv');
const { ValidationError } = require('./exceptions');

/**
 * 
 * @param {Array} validationErrors 
 * @returns 
 */
const parseErrors = (validationErrors) => {
    return validationErrors.map((err) => {
        let param = '';

        const currentParams = err.instancePath.split('/');
        if (currentParams.length > 1) {
            param = err.instancePath + '/' + err.params.additionalProperty;
        } else if (err.instancePath === '') {
            param = err.params.missingProperty || err.params.additionalProperty;
        }

        let keyword = err.keyword;
        if (err.keyword == 'errorMessage') {
            err.params.errors.forEach((paramErr) => {
                param = paramErr.params.missingProperty || paramErr.instancePath.slice(1);
                keyword = paramErr.keyword;
            });
        }

        return {
            param: param,
            key: keyword,
            message: err.message,
        };
    });
};

const ajvInit = new Ajv.default({
    allErrors: true,
    // jsonPointers: true,
    async: true,
    // loopRequired: 'Infinity', //200 default
    useDefaults: true,
});

const AjvFormats = require('ajv-formats');
const AjvErrors = require('ajv-errors');

require('ajv-keywords')(ajvInit, 'transform');
AjvFormats(ajvInit, { mode: 'fast', keywords: true });
AjvErrors(ajvInit);

const ajvPlugin = () => {
    /* eslint-disable no-useless-escape */
    ajvInit.addFormat('ObjectId', /^[0-9a-fA-F]{24}$/);
    ajvInit.addFormat(
        'dateLongIndo',
        /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9]) (2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?$/,
    );
    ajvInit.addFormat('dateShortIndo', /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])/);
    ajvInit.addFormat('24-hours-time', /^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/);
    ajvInit.addFormat('12-hours-time', /^(?:1[0-2]|0[0-9]):[0-5][0-9]:[0-5][0-9]$/);
    ajvInit.addFormat('strongPassword', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/);
    ajvInit.addFormat('numberString', /^\d+$/);
};

module.exports = {
    validateSchema: async (request, sourceFileJson) => {
        ajvPlugin();

        const valid = ajvInit.validate(sourceFileJson, request);

        if (!valid) {
            const errors = parseErrors(ajvInit.errors);
            throw new ValidationError(errors);
        }

        return Promise.resolve(request);
    },
};
