const Validator = require('../../../helpers/validateSchema');
const { AuthModel } = require('../../models');
const { UserRepository, CacheRepository } = require('../../repositories');
const { Encrypt, Decrypt, VerifyHashPassword } = require('../../../libraries/encrypting/AEAD');
const {
    SignAccessToken,
    SignRefreshToken,
    VerifyRefreshToken,
    DecodeJwtToken
} = require('../../../libraries/encrypting/jwt');

const { UnprocessableEntityError, ForbiddenError } = require('../../../helpers/exceptions');

const { v4: Uuidv4 } = require('uuid');
const Dayjs = require('dayjs');
const UnAuthorizedError = require('../../../helpers/exceptions/unAuthorizedError');

/**
 *
 * @param {object} data
 */
const setJwtPayload = (data) => {
    return {
        userName: data.userName,
        accountNumber: data.accountNumber,
        identityNumber: data.identityNumber
    };
};

/**
 *
 * @param {Number} identityNumber
 * @param {UUID} deviceId
 * @returns
 */
const keyAuthSession = (identityNumber, deviceId) => {
    return `${identityNumber}_${deviceId}`;
};

/**
 *
 * @param {object} dataUser
 * @param {object} userPayload
 */
const generateToken = async (dataUser, userPayload) => {
    const { deviceId, identityNumber } = userPayload;

    const payload = setJwtPayload(dataUser);

    const accessToken = await SignAccessToken(payload);
    const refreshToken = await SignRefreshToken(
        Encrypt({
            // accountNumber: dataUser.accountNumber,
            identityNumber: dataUser.identityNumber,
            deviceId: deviceId
        })
    );

    const authKey = keyAuthSession(dataUser.identityNumber, deviceId);
    //JWT expired base on config APP_REFRESH_TOKEN_EXPIRED in .env
    await CacheRepository.saveSession(authKey, refreshToken);

    const now = Dayjs();
    const modified = now.format();

    // store info device login
    const dataDivece = {
        $set: { lastLogin: modified },
        $push: {
            divices: {
                ipAddress: userPayload.ipAddress,
                userAgent: userPayload.userAgent,
                deviceId: deviceId,
                updatedAt: modified
            }
        }
    };

    await UserRepository.updateCustom({ identityNumber }, dataDivece);

    return { accessToken, refreshToken, deviceId };
};

module.exports = {
    signIn: async (payload) => {
        const payloadValid = await Validator.validateSchema(payload, AuthModel.SIGNIN);

        const user = await UserRepository.getUserByAccountNumber(payloadValid.accountNumber);
        if (!user) {
            throw new UnAuthorizedError();
        }

        const isPasswordValid = VerifyHashPassword(user.infoLogin, payloadValid.password);
        if (!isPasswordValid) {
            // throw new BadRequestError("Incorect Password or Username!");
            throw new UnAuthorizedError();
        }

        const loginId = Uuidv4();

        const token = await generateToken(user, payloadValid, loginId);

        return token;
    },

    /**
     * Refresh token only used once!
     * @param {object} payload
     */
    refreshToken: async (payload) => {
        try {
            const payloadValid = await Validator.validateSchema(payload, AuthModel.REFRESH_TOKEN);

            const isTokenValid = await VerifyRefreshToken(payloadValid.refreshToken);

            const decryptedPayload = JSON.parse(Decrypt(isTokenValid.data));

            const user = await UserRepository.getUserByIdentityNumber(decryptedPayload.identityNumber);
            if (!user) {
                throw new ForbiddenError();
            }

            const clause = { identityNumber: decryptedPayload.identityNumber };

            //check token stored
            const authKey = keyAuthSession(decryptedPayload.identityNumber, payloadValid.deviceId);
            const getCurrentRefreshToken = await CacheRepository.getSession(authKey);
            if (!getCurrentRefreshToken) {
                throw new ForbiddenError('Nice try :-');
            }

            //remove currentToken
            await CacheRepository.removeSession(authKey);

            //genereta new accessToken and refreshToken
            const token = await generateToken(user, payloadValid);

            return token;
        } catch (err) {
            //detect reuse token, anomaly
            if (err.message === 'jwt expired') {
                const expiredToken = await DecodeJwtToken(payload.refreshToken);
                const decodeExpiredToken = JSON.parse(Decrypt(expiredToken.data));

                // remove token from cache
                const authKey = keyAuthSession(decryptedPayload.identityNumber, payloadValid.deviceId);
                await CacheRepository.removeSession(authKey);
                //remove info device from db
                // await UserRepository.updateCustom(
                //     { accountNumber: decodeExpiredToken.accountNumber },
                //     { $unset: { devices: 1 } }
                // );

                throw new ForbiddenError();
            } else {
                throw err;
            }
        }
    },

    signOut: async (payload) => {
        const payloadValid = await Validator.validateSchema(payload, AuthModel.SIGNOUT);

        const isTokenValid = await VerifyRefreshToken(payloadValid.refreshToken);

        const decryptedPayload = JSON.parse(Decrypt(isTokenValid.data));

        const user = await UserRepository.getUserByIdentityNumber(decryptedPayload.identityNumber);
        if (!user) {
            throw new UnAuthorizedError();
        }

        const authKey = keyAuthSession(decryptedPayload.identityNumber, payloadValid.deviceId);
        await CacheRepository.removeSession(authKey);

        //Alldevices = true, remove all info devices and refresh token
        let removeDevice = {};
        if (payloadValid.allDevices) {
            removeDevice = { $unset: { devices: 1 } };
            await CacheRepository.removeAllActiveSession(decryptedPayload.identityNumber);
        } else {
            // logout current device
            removeDevice = {
                $pull: {
                    devices: { devices: payloadValid.deviceId }
                }
            };
            await CacheRepository.removeSession(decryptedPayload.identityNumber);
        }
        await UserRepository.updateCustom({ accountNumber: decryptedPayload.accountNumber }, removeDevice);

        return true;
    }
};
