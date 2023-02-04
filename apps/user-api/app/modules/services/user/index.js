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
        await UserRepository.isUsernameOrEmailExist(payload);

        const infoLogin = GenHashPassword(payload.password);
        let dataUser = userData(user, { infoLogin });

        return await UserRepository.save(dataUser, infoLogin);
    },

    updateUser: async (userId, payload) => {
        const user = await Validator.validateSchema(payload, UserModel.PUT);

        await Services.getUser(userId);
        let dataUser = userData(user, false);
        return await UserRepository.update(userId, dataUser);
    },

    getUser: async (userId) => {
        const user = await UserRepository.getByUserId(userId);
        if (!user) {
            throw new NotFoundError('User not found!');
        }
        return user;
    },

    getUserBy: async (query, options) => {
        const user = await UserRepository.findUser(query, options);
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
        const searchAbleFields = ["userName", "accountNumber", "emailAddress", "identityNumber"]

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

    updateCredentialUser: async (userId, payload) => {
        const userCredential = await Validator.validateSchema(payload, UserModel.PATCH);

        const filter = { projection: { infoLogin: 1 } };
        const getUser = await UserRepository.getByUserId(userId, filter);
        const isPasswordValid = VerifyHashPassword(getUser.infoLogin, userCredential.password);

        if (!isPasswordValid) {
            throw new BadRequestError('Incorect Password');
        }

        const newPassword = await GenHashPassword(userCredential.newPassword);

        const { value } = await UserRepository.update(userId, {
            infoLogin: newPassword,
        });
        return value;
    },

    deleteUser: async (userId) => {
        const { value } = await UserRepository.delete(userId);
        if (!value) {
            throw new BadRequestError('User not found');
        }
        return value;
    },
};

module.exports = Services;
