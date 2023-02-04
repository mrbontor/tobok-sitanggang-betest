const SUCCESS_CREATED = 201;
const SUCCESS_NO_CONTENT = 204;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const ACCESS_FORBIDDEN = 403;
const NOT_FOUND = 404;
const UNPROCESSABLE_ENTITY = 422;
const SERVER_ERROR = 500;

const COOKIE_REFRESH_TOKEN = 'RTOKEN';
const COOKIE_DEVICE_ID = 'DID';
const { ValidationError } = require('../exceptions');
const isSecure = process.env.ENV == 'development';

module.exports = {
    success: (res, data, message = 'Success') => {
        res.send({
            status: true,
            message: message,
            data,
        });
    },
    created: (res, data) => {
        res.status(SUCCESS_CREATED).send({
            status: true,
            // message: message,
            data,
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
            httpOnly: true,
            secure: isSecure,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000, //3 * 60 * 1000,
        }); //2 minutes
        res.cookie(COOKIE_DEVICE_ID, data.deviceId, {
            httpOnly: true,
            secure: isSecure,
            sameSite: 'None',
            maxAge: 1 * 365 * 24 * 60 * 60 * 1000,
        }); //1 year

        res.send({
            status: true,
            message: message,
            data: { accessToken: data.accessToken },
        });
    },

    successLogOut: (res) => {
        res.clearCookie(COOKIE_REFRESH_TOKEN, {
            httpOnly: true,
            sameSite: 'None',
            secure: isSecure,
        });

        res.sendStatus(SUCCESS_NO_CONTENT);
    },

    customStatus: (res, statusCode) => {
        res.sendStatus(statusCode);
    },

    customStatusWithMessage: (res, statusCode, message) => {
        res.status(statusCode).send({
            status: false,
            message: message,
        });
    },

    error: (res, error) => {
        console.log('error', error.message);
        let response = {};
        response.status = error.status;
        response.message = error.message;

        if (error instanceof ValidationError && Array.isArray(error.errors)) {
            response.errors = error.errors;
        }

        if (error instanceof ValidationError && Array.isArray(error.errors)) {
            response.errors = error.errors;
        }
        res.status(error.statusCode ? error.statusCode : BAD_REQUEST).send(response);
    },
};
