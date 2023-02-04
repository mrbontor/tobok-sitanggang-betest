const { UserService } = require('../../services');
const ResponseHelper = require('../../../helpers/response');

module.exports = {
    createUser: async (req, res) => {
        try {
            const data = await UserService.createUser(req.body);

            ResponseHelper.success(res, data);
        } catch (err) {
            console.error(`[CREATE][USER] >>>>> ${JSON.stringify(err.message)}`);
            ResponseHelper.error(res, err);
        }
    },

    updateInfoUser: async (req, res) => {
        try {
            const data = await UserService.updateUser(parseInt(req.params.identityNumber), req.body);
            ResponseHelper.success(res, data);
        } catch (err) {
            console.error(`[UPDATE][USER] >>>>> ${JSON.stringify(err.stack)}`);
            ResponseHelper.error(res, err);
        }
    },
    getUser: async (req, res) => {
        try {
            const data = await UserService.getUserByIdentityNumber(parseInt(req.params.identityNumber));
            ResponseHelper.success(res, data);
        } catch (err) {
            console.error(`[GET][ONE][USER] >>>>> ${JSON.stringify(err.message)}`);
            ResponseHelper.error(res, err);
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const data = await UserService.getAllUsers(req.query);
            ResponseHelper.success(res, data);
        } catch (err) {
            console.error(`[GET][ALL][USERS] >>>>> ${JSON.stringify(err.message)}`);
            ResponseHelper.error(res, err);
        }
    },

    getTableUsers: async (req, res) => {
        try {
            const data = await UserService.getTableUsers(req.query);
            ResponseHelper.success(res, data);
        } catch (err) {
            console.error(`[GET][TABLE][USERS] >>>>> ${JSON.stringify(err.stack)}`);
            ResponseHelper.error(res, err);
        }
    },

    updateCredentialUser: async (req, res) => {
        try {
            await UserService.updateCredentialUser(parseInt(req.params.identityNumber), req.body);
            ResponseHelper.noContent(res);
        } catch (err) {
            console.error(`[UPDATE][USER] >>>>> ${JSON.stringify(err.stack)}`);
            ResponseHelper.error(res, err);
        }
    },

    deleteUser: async (req, res) => {
        try {
            await UserService.deleteUser(parseInt(req.params.identityNumber));
            ResponseHelper.noContent(res);
        } catch (err) {
            console.error(`[DELETE][USER] >>>>> ${JSON.stringify(err.stack)}`);
            ResponseHelper.error(res, err);
        }
    },
};
