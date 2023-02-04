const Validator = require('../../../helpers/validateSchema');
const { AuthModel } = require('../../models');
const { UserRepository } = require('../../repositories');
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
 * @param {object} dataUser
 * @param {object} userPayload
 * @param {string} loginId
 */
const generateToken = async (dataUser, userPayload, loginId) => {
    const { deviceId } = userPayload;

    const payload = setJwtPayload(dataUser);

    const accessToken = await SignAccessToken(payload);
    const refreshToken = await SignRefreshToken(
        Encrypt({
            accountNumber: dataUser.accountNumber,
            loginId: loginId
        })
    );

    const now = Dayjs();
    const modified = now.format();

    const clause = { $or: [{ _id: dataUser._id }] };
    //identify existing token and replace
    let oldRefreshToken = [];
    if (typeof dataUser.token !== 'undefined') {
        oldRefreshToken = dataUser.token.filter(
            (el) => el.token === userPayload.refreshToken && el.deviceId === userPayload.deviceId // maybe need to removed.
        );

        /*
            check existing token at the same device
            Scenario :
            1) User logs in but never uses RT and does not logout
            2) RT is stolen
            3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
        */

        if (oldRefreshToken.length > 0) {
            // clause.$or.push({ "token.$.loginID": userPayload.refreshToken });
            await UserRepository.updateCustom(
                clause,
                {
                    $pull: {
                        token: { token: userPayload.refreshToken }
                    }
                },
                { multi: true }
            );
        }
    }

    // store new refresh token
    const dataSet = {
        $set: { modified: modified },
        $push: {
            token: {
                token: refreshToken,
                ipAddress: userPayload.ipAddress,
                userAgent: userPayload.userAgent,
                deviceId: userPayload.deviceId,
                updateAt: modified
            }
        }
    };

    await UserRepository.updateCustom(clause, dataSet);

    return { accessToken, refreshToken, deviceId };
};

module.exports = {
    signIn: async (payload) => {
        const dataPayload = await Validator.validateSchema(payload, AuthModel.SIGNIN);

        const user = await UserRepository.getUserByAccountNumber(dataPayload.accountNumber);
        if (!user) {
            throw new UnAuthorizedError();
        }

        const isPasswordValid = VerifyHashPassword(user.infoLogin, dataPayload.password);
        if (!isPasswordValid) {
            // throw new BadRequestError("Incorect Password or Username!");
            throw new UnAuthorizedError();
        }

        const loginId = Uuidv4();

        const token = await generateToken(user, dataPayload, loginId);

        return token;
    },

    /**
     * Refresh token only used once!
     * @param {object} payload
     */
    refreshToken: async (payload) => {
        try {
            const dataPayload = await Validator.validateSchema(payload, AuthModel.REFRESH_TOKEN);

            const isTokenValid = await VerifyRefreshToken(dataPayload.refreshToken);

            const decryptedPayload = JSON.parse(Decrypt(isTokenValid.data));

            const user = await UserRepository.getUserByAccountNumber(
                decryptedPayload.accountNumber
            );
            if (!user) {
                throw new ForbiddenError();
            }

            const clause = { accountNumber: decryptedPayload.accountNumber };

            //check token exist
            let oldRefreshToken = [];
            if (typeof user.token !== 'undefined' && user.token.length > 0) {
                oldRefreshToken = user.token.filter((el) => el.token === dataPayload.refreshToken);

                if (oldRefreshToken.length > 0) {
                    //remove current refresh token
                    await UserRepository.updateCustom(clause, {
                        $pull: {
                            token: { token: dataPayload.refreshToken }
                        }
                    });
                }
            } else {
                //the token has stolen, he mess with us
                throw new ForbiddenError();
            }

            const jwtPayload = setJwtPayload(user);

            //valid, generate new access token
            const newAccessToken = await SignAccessToken(jwtPayload);
            const newRefreshToken = await SignRefreshToken(
                Encrypt({
                    accountNumber: user.accountNumber,
                    loginId: Uuidv4()
                })
            );
            const now = Dayjs();
            const modified = now.format();

            const dataSet = {
                $set: { modified: modified },
                $push: {
                    token: {
                        token: newRefreshToken,
                        ipAddress: dataPayload.ipAddress,
                        userAgent: dataPayload.userAgent,
                        deviceId: dataPayload.deviceId
                    }
                }
            };

            await UserRepository.updateCustom(clause, dataSet);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                deviceId: dataPayload.deviceId
            };
        } catch (err) {
            //detect reuse token, anomaly
            if (err.message === 'jwt expired') {
                const expiredToken = await DecodeJwtToken(payload.refreshToken);
                const decodeExpiredToken = JSON.parse(Decrypt(expiredToken.data));

                //remove all token
                await UserRepository.updateCustom(
                    { accountNumber: decodeExpiredToken.accountNumber },
                    { $unset: { token: 1 } }
                );

                throw new ForbiddenError();
            } else {
                throw err;
            }
        }
    },

    signOut: async (payload) => {
        const dataPayload = await Validator.validateSchema(payload, AuthModel.SIGNOUT);

        const isTokenValid = await VerifyRefreshToken(dataPayload.refreshToken);

        const decryptedPayload = JSON.parse(Decrypt(isTokenValid.data));

        const user = await UserRepository.getUserByAccountNumber(decryptedPayload.accountNumber);
        if (!user) {
            throw new UnAuthorizedError();
        }

        let removeToken = {};

        //check token exist
        let oldRefreshToken = [];
        if (typeof user.token !== 'undefined') {
            oldRefreshToken = user.token.filter((el) => el.token === dataPayload.refreshToken);

            if (oldRefreshToken.length > 0) {
                removeToken = {
                    $pull: {
                        token: { token: dataPayload.refreshToken }
                    }
                };
            } else {
                return true;
            }
        }

        //Alldevices = true, remove all token
        if (dataPayload.allDevices) {
            removeToken = {
                $unset: { token: 1 }
            };
        }

        await UserRepository.updateCustom(
            { accountNumber: decryptedPayload.accountNumber },
            removeToken
        );

        return true;
    }
};
