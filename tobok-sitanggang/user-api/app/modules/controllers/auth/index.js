const { AuthService } = require('../../services');
const ResponseHelper = require('../../../helpers/response');
const { v4: Uuidv4, validate: ValidadtePayload } = require('uuid');

const isSecure = process.env.ENV == 'development';
const COOKIE_REFRESH_TOKEN = 'RTOKEN';
const setPayload = (req, other = {}) => {
    const cookies = req.cookies;
    // console.log("cookie", ValidadtePayload(cookies.DID));

    const deviceUniqueId = cookies.DID && ValidadtePayload(cookies.DID) ? cookies.DID : Uuidv4();

    return {
        ipAddress: req.header('x-forwarded-for') || req.connection.remoteAddress,
        userAgent: req.header('user-agent'),
        deviceId: deviceUniqueId,
        refreshToken: cookies.RTOKEN || null,
        ...req.body,
        ...other,
    };
};

module.exports = {
    signIn: async (req, res) => {
        try {
            const payload = setPayload(req);
            const data = await AuthService.signIn(payload);

            //check cookie r-token
            if (payload.refreshToken) {
                /*
                 Scenario:
                 1) User logs in but never uses RT and does not logout
                 2) RT is stolen
                 3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
                */

                res.clearCookie(COOKIE_REFRESH_TOKEN, {
                    httpOnly: true,
                    sameSite: 'None',
                    secure: isSecure,
                });
            }

            ResponseHelper.successLogIn(res, data);
        } catch (err) {
            console.error(`[LOGIN][USER] >>>>> ${JSON.stringify(err.stack)}`);
            ResponseHelper.error(res, err);
        }
    },

    refreshToken: async (req, res) => {
        try {
            const payload = setPayload(req);

            const data = await AuthService.refreshToken(payload);

            ResponseHelper.successLogIn(res, data);
        } catch (err) {
            console.error(`[REFRESH][TOKEN][USER] >>>>> ${JSON.stringify(err.stack)}`);
            ResponseHelper.error(res, err);
        }
    },

    signOut: async (req, res) => {
        try {
            const payload = setPayload(req, {
                allDevices: Boolean(req.query.allDevices),
            });

            if (!payload.refreshToken) {
                return ResponseHelper.successLogOut(res);
            }
            await AuthService.signOut(payload);

            ResponseHelper.successLogOut(res);
        } catch (err) {
            console.error(`[LOGOUT][USER] >>>>> ${JSON.stringify(err.message)}`);
            ResponseHelper.error(res, err);
        }
    },
};
