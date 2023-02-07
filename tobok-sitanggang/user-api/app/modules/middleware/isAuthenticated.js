const { VerifyAccessToken } = require('../../libraries/encrypting/jwt');
const ResponseHelper = require('../../helpers/response');
const { UserService } = require('../services');
const { CacheRepository } = require('../repositories');
const Logging = require('../../helpers/logging');
const { UnAuthorizedError, ForbiddenError } = require('../../helpers/exceptions');
const TOKEN_SECRET = process.env.APP_TOKEN_SECRET;
const UNAUTHORIZED = 401;
const UNPROCESSABLE_ENTITY = 422;
const COOKIE_REFRESH_TOKEN = 'RTOKEN';
const COOKIE_DEVICE_ID = 'DID';

const projection = ['userName', 'accountNumber', 'emailAddress', 'identityNumber'];
const isSecure = process.env.ENV != 'development';

module.exports = {
    verifyToken: async (req, res, next) => {
        try {
            const deviceId = req.cookies[COOKIE_DEVICE_ID];
            const authHeader = req.headers.authorization || req.headers.Authorization;
            if (!authHeader?.startsWith('Bearer ')) throw new UnAuthorizedError('Token invalid');
            const token = authHeader.split(' ')[1];

            //validate accessToken
            const isAccessTokenValid = await VerifyAccessToken(token, TOKEN_SECRET);
            Logging.info(`[VERIFY][ACCESS][TOKEN][MIDDLEWARE] >>>>> ${JSON.stringify(isAccessTokenValid)}`);
            if (!isAccessTokenValid) throw new UnAuthorizedError('Token invalid');

            //verify and ensure the accessToken was accessing in the same device
            //check if refreshToken exist for the accessToken
            //rule: every accessToken only have one RefreshToken
            const getRefreshToken = await CacheRepository.getSession(
                `${isAccessTokenValid.data.identityNumber}_${deviceId}`
            );
            Logging.info(`[VERIFY][REFRESH][TOKEN][EXIST] >>>>> ${JSON.stringify(getRefreshToken)}`);
            if (!getRefreshToken) {
                throw new ForbiddenError('Nice try :-');
            }

            req.userContext = isAccessTokenValid.data;
            next();
        } catch (err) {
            Logging.error(`[VERIFY][TOKEN][MIDDLEWARE] >>>>> ${JSON.stringify(err.message)}`);
            ResponseHelper.error(res, err);
        }
    }
};
