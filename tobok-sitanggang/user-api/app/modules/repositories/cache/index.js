const StringMath = require('string-math');
const Logging = require('../../../helpers/logging');
const Redis = require('../../../libraries/redis');

const KEY_CACHE = process.env.REDIS_CACHE_KEY || 'redis_toboksitanggang_betest';
const KEY_AUTH = process.env.REDIS_AUTH_KEY || 'redis_toboksitanggang-auth_betest';
const KEY_AUTH_EXPIRY = StringMath(process.env.APP_REFRESH_TOKEN_EXPIRED);

const parseJson = (payload) => {
    let results = [];
    for (let [_key, _value] of Object.entries(payload)) {
        try {
            results.push(JSON.parse(_value));
        } catch (error) {
            results.push(_value);
        }
    }
    return results;
};

module.exports = {
    save: async (identityNumber, payload) => {
        const add = await Redis.hSet(KEY_CACHE, identityNumber, JSON.stringify(payload));
        return add === 1 ? true : false;
    },
    get: async (identityNumber) => {
        const get = await Redis.hGet(KEY_CACHE, identityNumber.toString());
        if (get) {
            Logging.info('[CACHE][CALLED]');
            return get !== null ? JSON.parse(get) : null;
        }
    },
    getAll: async () => {
        const get = await Redis.hGetAll(KEY_CACHE);
        if (get) {
            Logging.info('[CACHE][CALLED]', get);
            return parseJson(get);
        }
    },

    remove: async (identityNumber) => {
        return await Redis.hDel(KEY_CACHE, identityNumber.toString());
    },

    //begin user session
    saveSession: async (key, payload) => {
        console.log(`${KEY_AUTH}_${key}`);
        const add = await Redis.setEx(`${KEY_AUTH}_${key}`, KEY_AUTH_EXPIRY, JSON.stringify(payload));
        return add === 1 ? true : false;
    },
    getSession: async (key) => {
        const get = await Redis.get(`${KEY_AUTH}_${key}`);
        return get !== null ? JSON.parse(get) : null;
    },

    removeSession: async (key) => {
        await Redis.del(`${KEY_AUTH}_${key}`);
    },
    //end user session

    //special action delete, care to used
    removeAllActiveSession: async (key) => {
        const keys = await Redis.keys(key);
        const results = [];
        for (var i = 0, len = keys.length; i < len; i++) {
            results.push(keys[i]);
        }
        await Redis.del(results.join());
    }
};
