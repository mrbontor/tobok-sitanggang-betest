const Redis = require('../../../libraries/redis');

const KEY_CACHE = process.env.REDIS_CACHE_KEY || 'redis_toboksitanggang_betest';
const KEY_CACHE_EXPIRY = process.env.REDIS_CACHE_EXPIRE || 5;

module.exports = {
    saveReponse: async (key, payload) => {
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

    save: async (userId, payload) => {
        const add = await Redis.hset(KEY_CACHE, userId, JSON.stringify(payload));
        return add === 1 ? true : false;
    },
    get: async (userId) => {
        const get = await Redis.hget(KEY_CACHE, userId.toString());
        if (get) {
            return JSON.parse(get);
        }
    },

    getAll: async () => {
        const get = await Redis.hgetall(KEY_CACHE);
        if (get) {
            return JSON.parse(get);
        }
    },

    remove: async (userId) => {
        return await Redis.hdel(KEY_CACHE, userId.toString());
    }
};
