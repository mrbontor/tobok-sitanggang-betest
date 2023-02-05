const { Router } = require('express');
const App = new Router();

const BodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Logging = require('../helpers/logging');
// setup CORS
const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-access-token, Authorization, DID'
    );
    res.header('Access-Control-Allow-Methods', 'POST, GET,PUT, OPTIONS, DELETE, PATCH');
    // next()
    if (req.method == 'OPTIONS') {
        res.sendStatus();
    } else {
        next();
    }
};

//enable CORS
App.use(allowCrossDomain);

App.use(BodyParser.json());
App.use(cookieParser());
App.use(BodyParser.urlencoded({ extended: false }));

// Handle server error
App.use((err, req, res, next) => {
    let response = {
        status: false,
        message: err.message
    };
    try {
        JSON.parse(req.body);
    } catch (e) {
        Logging.error('[MIDDLEWARE][ERROR] ' + err.message);
        response.message = e.message;
        res.status(400).send(response);
    }

    if (err) {
        Logging.error('[MIDDLEWARE][ERROR] ' + err.message);
        res.status(500).send(response);
    }

    next();
});

const ACTIVE_VERSION = process.env.ACTIVE_VERSION || 'v1';
const CurrentVersion = require(`./${ACTIVE_VERSION}`);
App.use(`/${ACTIVE_VERSION}`, CurrentVersion);

//Handle 404 for api not exist
App.use((req, res, next) => {
    err = new Error('Not Found');
    res.sendStatus('404');
});

const { ErrorHandler } = require('../modules/middleware');
App.use(ErrorHandler);

module.exports = App;
