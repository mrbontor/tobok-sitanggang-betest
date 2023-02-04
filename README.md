
# tobok-sitanggang-betest

### Requirements

- [Git](https://www.odoo.com/documentation/15.0/contributing/documentation.html#install-git)
- [Node JS >= 16.15](https://nodejs.org/en/blog/release/v14.17.3/)
- [MongoDb Driver](https://www.mongodb.com/docs)
- [MongoDb Server](https://hub.docker.com/_/mongo/).
- [ExpressJS](https://expressjs.com/en/4x/api.html)
- [Redis](https://redis.io/docs/)
- [JWT Token](https://jwt.io/introduction)
- [Ajv](https://ajv.js.org/guide/getting-started.html)
- [Docker and Docker Compose](https://docs.docker.com/get-docker/)
- [Ajv and AJv Plugins](https://ajv.js.org/guide/getting-started.html)
- [Uuid](https://github.com/uuidjs/uuid)
- [Docker and Docker Compose](https://docs.docker.com/get-docker/)
- [Winston]https://www.npmjs.com/package/winston)
- [Postman](https://learning.postman.com/docs/getting-started/introduction/)


### Settings & Configuring

#### App config


Please check the file `env.example` and change to `.env`
there are 2 `.env` files, and both are required.
- one in root folder to define server needs
- one in `./apps/user-api` to setup the API


```env
NODE_ENV             = development
APP_PORT            = 3000
APP_ISSUER          = gitbub.com/mrbontor
....

```

#### Database config

This mini microservice is developed using Docker and Docker Compose,
Hint:
- If you are going to use your existing MongoDb and Redis, please change the configuration in `./.env` and `./apps/user-api/.env` (i expects the env files has been renamed)
- If you are using MongoAtlas or other Mongo Cloud, please set variable `MONGO_LOCAL` to true in `./apps/user-api/.env` 
### Deployment && Testing

#### Deployment && Usage


Running service using `Docker` and `Docker-Compose`

```sh
# start
$ docker-compose up

# stop
$ docker-compose down

# remove
$ docker-compose down -v
```

Running for existing MongoDB and Redis

```sh
# enter to the user-api
$ cd apps/user-api

# install dependencies
$ npm install

# run app
$ npm start

# or
$ node index.js
```