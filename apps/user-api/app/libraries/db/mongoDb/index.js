const { MongoClient, ObjectId } = require('mongodb');

const env = process.env
const isLocal = env.MONGO_LOCAL || true;

const config = {
    user: env.MONGO_USER,
    password: env.MONGO_PASSWORD,
    host: env.MONGO_HOST,
    port: env.MONGO_DOCKER_PORT,
    database: env.MONGO_DB,
    interval: env.MONGO_INTERVAL,
};

const setUri = isLocal ? 'mongodb' : 'mongodb+srv'

const mongoUrl = `${setUri}://${config.user}:${config.password}@${config.host}/${config.database}?retryWrites=true&w=majority`;

const conOptions = { useNewUrlParser: true };

let client = new MongoClient(mongoUrl, conOptions);

module.exports = {
    connect: async () => {
        try {
            const connection = await client.connect();
            client = connection.db(config.database);

            console.info('[MONGODB] successfully connected!!!');
            return client;
        } finally {
            // Ensures that the client will close when you finish/error
            // await client.close();
        }
    },
    closeDb: () => client.close(),
    getDb: () => client,
    isValidId: (id) => {
        if (ObjectId.isValid(id)) {
            if (String(new ObjectId(id)) === id) return true;

            return false;
        }
        return false;
    },
    ObjectId,
};
