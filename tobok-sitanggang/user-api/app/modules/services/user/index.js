const Validator = require('../../../helpers/validateSchema');
const { UserModel } = require('../../models');
const { UserRepository, CacheRepository } = require('../../repositories');
const { GenHashPassword, VerifyHashPassword } = require('../../../libraries/encrypting/AEAD');
const {
    UnprocessableEntityError,
    BadRequestError,
    NotFoundError
} = require('../../../helpers/exceptions');

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

    getUserByIdentityNumber: async (IdentityNumber) => {
        const user = await UserRepository.getUserByIdentityNumber(IdentityNumber);
        if (!user) {
            throw new NotFoundError('User not found!');
        }
        return user;
    },

    getUserByAccountNumber: async (accountNumber, options) => {
        const user = await UserRepository.getUserByAccountNumber(accountNumber, options);
        if (!user) {
            throw new NotFoundError('User not found!');
        }
        return user;
    },

    getAllUsers: async (query) => {
        const projection = {
            userName: 1,
            accountNumber: 1,
            emailAddress: 1,
            identityNumber: 1
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
        const getUser = await UserRepository.getUserByAccountNumber(IdentityNumber, filter);
        const isPasswordValid = VerifyHashPassword(getUser.infoLogin, userCredential.password);

        if (!isPasswordValid) {
            throw new BadRequestError('Incorect Password');
        }

        const newPassword = await GenHashPassword(userCredential.newPassword);

        const { value } = await UserRepository.update(IdentityNumber, {
            infoLogin: newPassword
        });
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
