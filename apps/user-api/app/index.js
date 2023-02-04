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

//Initialize redis connection
const confRedis = {
    url: `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}/`,
    checkpoint: 'redis-key',    
};

const Redis = require('./libraries/redis');
Redis.init(confRedis);
// Redis.auth(process.env.REDIS_PASSWORD);
Redis.connect();

const redisHealth = async () => {
    try {
        const redisHealth = await Redis.ping();
        if ('PONG' === redisHealth) Logging.info('[REDIS] Connection established');
    } catch (err) {
        Logging.error('[REDIS] connection failed...' + err);
    }
};
redisHealth();

//API check healt
App.get('/', (req, res, next) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };
    try {
        res.send(healthcheck);
    } catch (error) {
        healthcheck.message = error;
        res.status(503).send();
    }
});

const Router = require('./api');
App.use('/api', Router);

module.exports = App;
