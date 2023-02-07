const redis = require('redis');

class Redis {
    init(args) {
        args.retry_strategy = (options) => {
            if (options.error && options.error.code === 'ECONNREFUSED') {
                // End reconnecting on a specific error and flush all commands with
                // a individual error
                return new Error('The server refused the connection');
            }
            if (options.total_retry_time > 1000 * 60 * 60) {
                // End reconnecting after a specific timeout and flush all commands
                // with a individual error
                return new Error('Retry time exhausted');
            }
            if (options.attempt > 10) {
                // End reconnecting with built in error
                return undefined;
            }
            // reconnect after
            return Math.min(options.attempt * 100, 3000);
        };
        this.client = redis.createClient(args);
    }

    async auth(password) {
        return await this.client.auth(password);
    }

    async connect() {
        return await this.client.connect();
    }

    async ping() {
        return await this.client.ping();
    }

    async set(key, message) {
        return await this.client.set(key, message);
    }
    async setEx(key, expire, message) {
        return await this.client.setEx(key, expire, message);
    }
    async get(key) {
        return await this.client.get(key);
    }

    async del(key) {
        await this.client.del(key);
    }

    async hSet(key, id, message) {
        return await this.client.hSet(key, id, message);
    }

    async hGet(key, id) {
        return await this.client.hGet(key, id);
    }

    async hGetAll(key, id) {
        return await this.client.hGetAll(key, id);
    }

    async hDel(key, id) {
        await this.client.hDel(key, id);
    }

    async end() {
        await this.client.end(true);
    }
    async keys(pattern) {
        return await this.client.keys(`*${pattern}*`);
    }
}

module.exports = new Redis();
