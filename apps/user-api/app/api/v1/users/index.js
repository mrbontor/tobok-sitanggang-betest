const express = require('express');
const App = express();

const { UserController } = require('../../../modules/controllers');

const { VerifyToken } = require('../../../modules/middleware');

App.use(VerifyToken.verifyToken);

App.get('/', UserController.getAllUsers);
App.get('/table', UserController.getTableUsers);
App.get('/:identityNumber', UserController.getUser);
App.post('/', UserController.createUser);
App.put('/:identityNumber', UserController.updateInfoUser);
App.patch('/:identityNumber', UserController.updateCredentialUser);
App.delete('/:identityNumber', UserController.deleteUser);

module.exports = App;
