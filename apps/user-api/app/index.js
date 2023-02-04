const Express = require('express');
const App = Express();
// Initialize config file
require('dotenv').config();

const Logging = require('./helpers/logging');
process.env.TZ = 'Asia/Jakarta';

// Initialize logging
Logging.init({
    path: process.env.LOG_PATH,
    level: process.env.LOG_LEVEL,
    type: process.env.LOG_TYPE, //Logging or write to file
    filename: process.env.LOG_FILENAME
});

const DbCon = require('./libraries/db/mongoDb');
DbCon.connect();


module.exports = App;
