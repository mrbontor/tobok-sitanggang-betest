const Jwt = require('jsonwebtoken');
const StringMath = require('string-math');

const ENV = process.env;
const TOKEN_SECRET = ENV.APP_TOKEN_SECRET;
const TOKEN_EXPIRY = StringMath(ENV.APP_TOKEN_EXPIRED);
const REFRESH_TOKEN_SECRET = ENV.APP_REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY = StringMath(ENV.APP_REFRESH_TOKEN_EXPIRED);

const ISSUER = ENV.APP_ISSUER || 'github.com/mrbontor';

const signAccessToken = (payload) => {
    return new Promise((resolve, reject) => {
        const options = {
            expiresIn: TOKEN_EXPIRY,
            issuer: ISSUER,
            audience: ISSUER
        };
        Jwt.sign({ data: payload }, TOKEN_SECRET, options, (err, token) => {
            if (err) reject(err);

            resolve(token);
        });
    });
};

const verifyAccessToken = (token) => {
    return new Promise((resolve, reject) => {
        Jwt.verify(token, TOKEN_SECRET, (err, payload) => {
            if (err) {
                reject(err);
            }

            resolve(payload);
        });
    });
};

const signRefreshToken = (payload) => {
    return new Promise((resolve, reject) => {
        const options = {
            expiresIn: REFRESH_TOKEN_EXPIRY,
            issuer: ISSUER,
            audience: ISSUER
        };
        Jwt.sign({ data: payload }, REFRESH_TOKEN_SECRET, options, (err, token) => {
            if (err) reject(err);

            resolve(token);
        });
    });
};

const verifyRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        Jwt.verify(token, REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) {
                reject(err);
            }

            resolve(payload);
        });
    });
};

const decodeJwtToken = (token) => {
    return new Promise((resolve, reject) => {
        Jwt.verify(token, REFRESH_TOKEN_SECRET, { ignoreExpiration: true }, (err, payload) => {
            if (err) {
                reject(err);
            }

            resolve(payload);
        });
    });
};

module.exports = {
    SignAccessToken: signAccessToken,
    VerifyAccessToken: verifyAccessToken,
    SignRefreshToken: signRefreshToken,
    VerifyRefreshToken: verifyRefreshToken,
    DecodeJwtToken: decodeJwtToken
};
