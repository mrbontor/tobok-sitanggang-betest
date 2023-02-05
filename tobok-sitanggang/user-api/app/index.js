const Express = require('express');
const App = Express();

// Initialize config file
require('dotenv').config();
process.env.TZ = 'Asia/Jakarta';

const ENV = process.env;

const Logging = require('./helpers/logging');
// Initialize logging
Logging.init({
    path: ENV.LOG_PATH,
    level: ENV.LOG_LEVEL,
    type: ENV.LOG_TYPE, //Logging or write to file
    filename: ENV.LOG_FILENAME
});

const DbCon = require('./libraries/db/mongoDb');
DbCon.connect();
const MongoHealth = async () => {
    try {
        await DbCon.ping();
        Logging.info('[MONGODB] Connection established');
    } catch (err) {
        Logging.error('[MONGODB] connection failed...' + err);
    }
};
MongoHealth();

//Initialize redis connection
const confRedis = {
    url: `redis://${ENV.REDIS_HOSTNAME}:${ENV.REDIS_PORT}/`,
    // checkpoint: 'redis-key'
};

const Redis = require('./libraries/redis');
Redis.init(confRedis);
// Redis.auth(process.env.REDIS_PASSWORD);
Redis.connect();

const RedisHealth = async () => {
    try {
        const redisHealth = await Redis.ping();
        if ('PONG' === redisHealth) Logging.info('[REDIS] Connection established');
    } catch (err) {
        Logging.error('[REDIS] connection failed...' + err);
    }
};
RedisHealth();

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
