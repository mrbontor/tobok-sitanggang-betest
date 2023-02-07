const Mongo = require('../../../libraries/db/mongoDb');
const client = Mongo.getDb().db();
const Logging = require('../../../helpers/logging');
const CacheRepository = require('../cache');
const { buildQueryMongoPagination, buildResponsePagination } = require('../../../helpers/mongoDbPagination');
const {
    UnprocessableEntityError,
    GeneralError,
    BadRequestError,
    NotFoundError
} = require('../../../helpers/exceptions');

const COLLECTION_NAME = 'user';

module.exports = {
    save: async (data = {}, options = {}) => {
        const user = await client.collection(COLLECTION_NAME).insertOne(data, options);
        if (!user.insertedId) {
            throw new GeneralError('Something went wrong, please try again!');
        }
        await CacheRepository.save(data.identityNumber, data);

        await client.collection(COLLECTION_NAME).createIndexes([
            { name: 'userName', key: { userName: 1 }, unique: true },
            { name: 'emailAddress', key: { emailAddress: -1 }, unique: true },
            { name: 'identityNumber', key: { identityNumber: 1 }, unique: true },
            { name: 'accountNumber', key: { accountNumber: 1 }, unique: true }
            // {
            //     key: { accountNumber: 1, identityNumber: 1 },
            //     unique: true
            // }
        ]);
        return user.insertedId;
    },

    update: async (identityNumber, payload = {}) => {
        const clause = { identityNumber: identityNumber };
        const data = { $set: payload };
        const options = { upsert: false, returnDocument: 'after' };
        const updateUser = await client.collection(COLLECTION_NAME).findOneAndUpdate(clause, data, options);
        if (!updateUser.value) throw new NotFoundError('User not found!');
        await CacheRepository.save(identityNumber, updateUser.value);
        return updateUser.value;
    },

    updateCustom: async (filter, payload = {}) => {
        let update = await client.collection(COLLECTION_NAME).updateOne(filter, payload);
        return update;
    },

    getUserByAccountNumber: async (accountNumber, projection = {}) => {
        const cache = await CacheRepository.getAll();
        if (cache && cache.length > 0) {
            const result = cache.filter((el) => el.accountNumber === accountNumber)[0];
            if (result.infoLogin) return result;
        }

        const user = await client.collection(COLLECTION_NAME).findOne({ accountNumber }, projection);

        if (!user) throw new NotFoundError('User not found!');

        await CacheRepository.save(user.identityNumber, user);
        return user;
    },

    getUserByIdentityNumber: async (identityNumber, projection = {}) => {
        const cache = await CacheRepository.get(identityNumber);
        if (cache) {
            return cache;
        }

        const user = await client.collection(COLLECTION_NAME).findOne({ identityNumber }, projection);
        if (!user) throw new NotFoundError('User not found!');
        await CacheRepository.get(user.identityNumber, user);
        return user;
    },
    getUserCredential: async (identityNumber, projection = {}) => {
        const user = await client.collection(COLLECTION_NAME).findOne({ identityNumber }, projection);
        if (!user) throw new NotFoundError('User not found!');
        return user;
    },

    getAllUsers: async (payload = null, projection = null) => {
        const { search, accountNumber, identityNumber } = payload;
        if (identityNumber) {
            const cache = await CacheRepository.get(identityNumber);
            return [cache];
        }
        if (payload !== {}) {
            const cache = await CacheRepository.getAll();
            return cache;
        }

        let query = {};
        let options = [{ $sort: { userName: 1 } }];

        if (search) {
            query.$or = [
                { userName: { $regex: search, $options: 'i' } },
                { emailAddress: { $regex: search, $options: 'i' } }
            ];

            options.push({ $limit: 10 });
        }

        let accountNumbers = [];
        if (accountNumber) {
            accountNumbers = accountNumber.replace(/\s/g, '').split(',');

            const ans = accountNumbers.map((el) => parseInt(el));
            query.accountNumber = { $in: ans };
        }
        let identityNumbers = [];
        if (identityNumber) {
            identityNumbers = identityNumber.replace(/\s/g, '').split(',');

            const ins = identityNumbers.map((el) => parseInt(el));
            query.identityNumber = { $in: ins };
        }

        if (projection) {
            options.push({ $project: projection });
        }
        const queryUser = [{ $match: query }, ...options];

        const users = (await client.collection(COLLECTION_NAME).aggregate(queryUser).toArray()) || [];
        return users;
    },

    getTableUsers: async (payload = {}, fieldSearch = [], projection = null) => {
        const query = buildQueryMongoPagination(payload, fieldSearch, projection);
        const queryTable = [
            {
                $facet: {
                    data: query,
                    count: [
                        {
                            $group: {
                                _id: 1,
                                totalRecord: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ];

        const list = await client.collection(COLLECTION_NAME).aggregate(queryTable).toArray();

        return buildResponsePagination(payload, list);
    },

    delete: async (identityNumber) => {
        await CacheRepository.remove(identityNumber);
        return await client
            .collection(COLLECTION_NAME)
            .findOneAndDelete({ identityNumber }, { projection: { _id: 1 } });
    }
};
