const Validator = require('../../../helpers/validateSchema');
const { UserModel } = require('../../models');
const { UserRepository, CacheRepository } = require('../../repositories');
const { GenHashPassword, VerifyHashPassword } = require('../../../libraries/encrypting/AEAD');
const { UnprocessableEntityError, BadRequestError, NotFoundError } = require('../../../helpers/exceptions');

const userData = (payload, other = {}, isUpdate = false) => {
    const now = new Date();
    let defaultData = {
        ...other,
        createdAt: now,
        updatedAt: now
    };
    if (isUpdate) {
        delete defaultData.createdAt;
    }
    delete payload.password;
    return { ...payload, ...defaultData };
};

const Services = {
    createUser: async (payload) => {
        const user = await Validator.validateSchema(payload, UserModel.POST);

        const infoLogin = GenHashPassword(payload.password);
        let dataUser = userData(user, { infoLogin });

        return await UserRepository.save(dataUser, infoLogin);
    },

    updateUser: async (IdentityNumber, payload) => {
        const user = await Validator.validateSchema(payload, UserModel.PUT);

        const dataUser = userData(user, false);

        return await UserRepository.update(IdentityNumber, dataUser);
    },

    getUserByIdentityNumber: async (IdentityNumber, options) => {
        const user = await UserRepository.getUserByIdentityNumber(IdentityNumber, options);
        return user;
    },

    getUserByAccountNumber: async (accountNumber, options) => {
        const user = await UserRepository.getUserByAccountNumber(accountNumber, options);
        return user;
    },

    getAllUsers: async (query) => {
        const projection = {
            userName: 1,
            accountNumber: 1,
            emailAddress: 1,
            identityNumber: 1,
            infoLogin: 1
        };
        return await UserRepository.getAllUsers(query, projection);
    },

    getTableUsers: async (query) => {
        const searchAbleFields = ['userName', 'accountNumber', 'emailAddress', 'identityNumber'];

        const projection = {
            userName: 1,
            accountNumber: 1,
            emailAddress: 1,
            identityNumber: 1,
            createdAt: 1,
            updatedAt: 1
        };
        return await UserRepository.getTableUsers(query, searchAbleFields, projection);
    },

    updateCredentialUser: async (IdentityNumber, payload) => {
        const userCredential = await Validator.validateSchema(payload, UserModel.PATCH);

        const filter = { projection: { infoLogin: 1 } };
        const getUser = await UserRepository.getUserCredential(IdentityNumber, filter);
        const isPasswordValid = VerifyHashPassword(getUser.infoLogin, userCredential.password);

        if (!isPasswordValid) throw new BadRequestError('Incorect Password');

        const newPassword = await GenHashPassword(userCredential.newPassword);

        const { value } = await UserRepository.update(IdentityNumber, { infoLogin: newPassword, token: [] });
        return value;
    },

    deleteUser: async (IdentityNumber) => {
        const { value } = await UserRepository.delete(IdentityNumber);
        if (!value) {
            throw new BadRequestError('User not found');
        }
        return value;
    }
};

module.exports = Services;
