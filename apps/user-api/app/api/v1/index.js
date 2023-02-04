const { Router } = require('express');

const App = new Router();

const UserApi = require('./users');
const AuhtApi = require('./auth');

App.use('/users', UserApi);
App.use('/auth', AuhtApi);

module.exports = App;
