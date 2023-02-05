const fs = require('fs');

module.exports = {
    SIGNIN: JSON.parse(fs.readFileSync(__dirname + '/signIn.json')),
    REFRESH_TOKEN: JSON.parse(fs.readFileSync(__dirname + '/refreshToken.json')),
    SIGNOUT: JSON.parse(fs.readFileSync(__dirname + '/signOut.json'))
};
