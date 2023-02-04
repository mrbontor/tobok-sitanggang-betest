const App = require('./app');
const Logging = require('./app/helpers/logging');

const port = process.env.APP_PORT || 3000;

App.listen(port);
Logging.info('[APP] API-USER STARTED on ' + port);
