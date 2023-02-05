const { VerifyAccessToken } = require('../../libraries/encrypting/jwt');
const ResponseHelper = require('../../helpers/response');
const { UserService } = require('../services');
const logging = require('../../helpers/logging');
const { UnAuthorizedError } = require('../../helpers/exceptions');

const TOKEN_SECRET = process.env.APP_TOKEN_SECRET;
const UNAUTHORIZED = 401;
const UNPROCESSABLE_ENTITY = 422;
const COOKIE_REFRESH_TOKEN = 'RTOKEN';

const projection = ['userName', 'accountNumber', 'emailAddress', 'identityNumber'];
const isSecure = process.env.ENV != 'development';

module.exports = {
    verifyToken: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization || req.headers.Authorization;
            if (!authHeader?.startsWith('Bearer ')) throw new UnAuthorizedError('Token invalid');

            const token = authHeader.split(' ')[1];

            const isTokenValid = await VerifyAccessToken(token, TOKEN_SECRET);
            logging.info(`[VERIFY][TOKEN][MIDDLEWARE] >>>>> ${JSON.stringify(isTokenValid)}`);
            if (!isTokenValid) throw new UnAuthorizedError('Token invalid');

            const user = await UserService.getUserByAccountNumber(isTokenValid.data.accountNumber, {
                projection: projection
            });

            logging.info(`[VERIFY][USER][MIDDLEWARE] >>>>> ${JSON.stringify(user)}`);

            req.userContext = isTokenValid.data;
            next();
        } catch (err) {
            logging.error(`[VERIFY][TOKEN][MIDDLEWARE] >>>>> ${JSON.stringify(err.message)}`);
            ResponseHelper.error(res, err);
        }
    }
};
