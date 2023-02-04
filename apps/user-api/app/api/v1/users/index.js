const express = require('express');
const App = express();

const { UserController } = require('../../../modules/controllers');

// const { VerifyToken } = require('../../../modules/middleware');

// App.use(VerifyToken.verifyToken);

App.get('/', UserController.getAllUsers);
App.get('/table', UserController.getTableUsers);
App.get('/:userId', UserController.getUser);
App.post('/', UserController.createUser);
App.put('/:userId', UserController.updateInfoUser);
App.patch('/:userId', UserController.updateCredentialUser);
App.patch('/status/:userId', UserController.updateLoginStatusUser);
App.delete('/:userId', UserController.deleteUser);

module.exports = App;
