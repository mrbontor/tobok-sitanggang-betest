const { Router } = require('express');

const App = new Router();

const UserApi = require('./users');

App.use('/users', UserApi);

module.exports = App;
