const { Router } = require('express');
const App = new Router();

const { AuthController } = require('../../../modules/controllers');

App.post('/login', AuthController.signIn);
App.post('/register', AuthController.signUp);

const { VerifyToken } = require('../../../modules/middleware');
App.use(VerifyToken.verifyToken);

App.get('/refresh-token', AuthController.refreshToken);
App.get('/logout', AuthController.signOut);

module.exports = App;
