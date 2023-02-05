const Logging = require('../../../helpers/logging');
const Redis = require('../../../libraries/redis');

const KEY_CACHE = process.env.REDIS_CACHE_KEY || 'redis_toboksitanggang_betest';
const KEY_CACHE_EXPIRY = process.env.REDIS_CACHE_EXPIRE || 5;

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
    saveReponse: async (key, payload) => {
        console.log(`${KEY_CACHE}_${key}`);
        const add = await Redis.setEx(`${KEY_CACHE}_${key}`, KEY_CACHE_EXPIRY, JSON.stringify(payload));
        return add === 1 ? true : false;
    },
    getReponse: async (key) => {
        const get = await Redis.get(`${KEY_CACHE}_${key}`);
        if (get) {
            return JSON.parse(get);
        }
    },

    removeResponse: async (key) => {
        await Redis.del(`${KEY_CACHE}_${key}`);
    },

    save: async (identityNumber, payload) => {
        const add = await Redis.hSet(KEY_CACHE, identityNumber, JSON.stringify(payload));
        return add === 1 ? true : false;
    },
    get: async (identityNumber) => {
        const get = await Redis.hGet(KEY_CACHE, identityNumber.toString());
        if (get) {
            Logging.info('[CACHE][CALLED]');
            return JSON.parse(get);
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
    }
};
