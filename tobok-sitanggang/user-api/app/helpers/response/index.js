const StringMath = require('string-math');
const Logging = require('../logging');
const { ValidationError, GeneralError } = require('../exceptions');

const ENV = process.env;

const TOKEN_EXPIRY = StringMath(ENV.APP_TOKEN_EXPIRED) || '1m';
const REFRESH_TOKEN_EXPIRY = StringMath(ENV.APP_REFRESH_TOKEN_EXPIRED) || '1m';
const DEVICE_ID_EXPIRY = StringMath(ENV.APP_DEVICE_ID_EXPIRED) || '1m';

const SUCCESS_CREATED = 201;
const SUCCESS_NO_CONTENT = 204;
const BAD_REQUEST = 400;
const UNPROCESSABLE_ENTITY = 422;
const UNAUTHORIZED = 401;
const ACCESS_FORBIDDEN = 403;
const INTERNAL_SERVER_ERROR = 500;

const COOKIE_REFRESH_TOKEN = 'RTOKEN';
const COOKIE_DEVICE_ID = 'DID';

const isSecure = ENV.NODE_ENV == 'development';

module.exports = {
    success: (res, data, message = 'Success') => {
        res.send({
            status: true,
            message: message,
            data
        });
    },
    created: (res, data) => {
        res.status(SUCCESS_CREATED).send({
            status: true,
            // message: message,
            data
        });
    },
    noContent: (res) => {
        res.sendStatus(SUCCESS_NO_CONTENT);
    },

    successLogIn: (res, data, message = 'Success') => {
        // res.cookie(COOKIE_TOKEN, data.accessToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "None",
        //     maxAge: 2 * 60 * 1000,
        // });

        res.cookie(COOKIE_REFRESH_TOKEN, data.refreshToken, {
            httpOnly: isSecure,
            secure: isSecure ? false : false,
            sameSite: 'None',
            maxAge: REFRESH_TOKEN_EXPIRY
        });
        res.cookie(COOKIE_DEVICE_ID, data.deviceId, {
            httpOnly: isSecure,
            secure: isSecure ? false : false,
            sameSite: 'None',
            maxAge: DEVICE_ID_EXPIRY
        });

        res.send({
            status: true,
            message: message,
            data: { accessToken: data.accessToken }
        });
    },

    successLogOut: (res) => {
        res.clearCookie(COOKIE_REFRESH_TOKEN, {
            httpOnly: isSecure,
            sameSite: 'None',
            secure: isSecure ? false : false
        });

        res.sendStatus(SUCCESS_NO_CONTENT);
    },

    customStatus: (res, statusCode) => {
        res.sendStatus(statusCode);
    },

    customStatusWithMessage: (res, statusCode, message) => {
        res.status(statusCode).send({
            status: false,
            message: message
        });
    },

    error: (res, error) => {
        if (isSecure) {
            Logging.error(JSON.stringify(error.name));
            Logging.error(JSON.stringify(error.message));
        }
        let response = {};
        response.status = error.status || false;
        response.message = error.message;

        if (error instanceof ValidationError && Array.isArray(error.errors)) {
            response.errors = error.errors;
        }

        if (error.name === 'MongoServerError') {
            let detilErr = 'Something went wrong!';
            if (error.message.indexOf('userName') >= 0) detilErr = 'The userName has been registered!';
            if (error.message.indexOf('emailAddress') >= 0) detilErr = 'The emailAddress has been registered!';
            if (error.message.indexOf('identityNumber') >= 0) detilErr = 'The identityNumber has been registered!';
            if (error.message.indexOf('accountNumber') >= 0) detilErr = 'The accountNumber has been registered!';

            error.statusCode = UNPROCESSABLE_ENTITY;
            response.message = detilErr;
        }

        if (error.name === 'JsonWebTokenError') {
            error.statusCode = UNAUTHORIZED;
            response.message = 'Token Invalid';

            res.clearCookie(COOKIE_REFRESH_TOKEN, {
                httpOnly: true,
                sameSite: 'None',
                secure: isSecure
            });
        }

        if (error.name === 'TypeError') {
            error.statusCode = INTERNAL_SERVER_ERROR;
            response.message = 'Something went wrong!, please contact administrator';
        }

        res.status(error.statusCode ? error.statusCode : BAD_REQUEST).send(response);
    }
};
