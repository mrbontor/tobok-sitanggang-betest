/**
 * AEAD is Authentication Encrypting and Decrypting
 * author : mrbontor@gmail.com
 */

const Crypto = require('crypto');

const ALGORITM = 'sha512';
const CRYPTING_ALGORITM = 'aes-256-gcm';
const KEY = process.env.APP_KEY || 'OWM5YTc2NzM5ZjgyNGQ2Njg2OTJjZDFkMzE2ZTFlMWI=';

const RANDOM_BYTE = 128;
const MAX_NUMBER = 10000;
const MIN_NUMBER = 1000;

/**
 * 
 * @param {Number} max 
 * @param {Number} min 
 * @returns 
 */
const genNumberCode = (max, min) => {
    return Math.floor(Math.random() * (max - 1 + 1) + min);
};

/**
 * 
 * @param {String} password 
 * @returns 
 */
const genHashPassword = (password) => {
    const salt = Crypto.randomBytes(RANDOM_BYTE).toString('base64');
    const iterations = genNumberCode(MAX_NUMBER, MIN_NUMBER);

    const hash = Crypto.pbkdf2Sync(password, salt, iterations, 64, ALGORITM).toString(`hex`);

    return {
        hash: hash,
        salt: salt,
        iterations: iterations,
    };
};

/**
 * 
 * @param {Object} infoLogin 
 * @param {String} password 
 * @returns 
 */
const verifyHashPassword = (infoLogin, password) => {
    const hashed = Crypto.pbkdf2Sync(password, infoLogin.salt, infoLogin.iterations, 64, ALGORITM).toString(`hex`);

    return infoLogin.hash === hashed;
};

/**
 * 
 * @param {String} text 
 * @returns 
 */
const encrypt = (text) => {
    let string = null;
    if (typeof text === 'object') {
        string = JSON.stringify(text);
    } else {
        string = text;
    }

    const iv = Crypto.randomBytes(12);

    const cipher = Crypto.createCipheriv(CRYPTING_ALGORITM, Buffer.from(KEY, 'base64'), iv);
    // let encrypted = cipher.update(text);
    const encrypted = Buffer.concat([cipher.update(string), cipher.final()]);

    const auth = cipher.getAuthTag().toString('base64');

    const cipherText = JSON.stringify({
        iv: iv.toString('base64'),
        encryptedData: encrypted.toString('base64'),
        auth: auth,
    });

    return Buffer.from(cipherText).toString('base64');
};

/**
 * 
 * @param {String} text 
 * @returns 
 */
const decrypt = (text) => {
    const chiperText = JSON.parse(Buffer.from(text, 'base64'));

    const iv = Buffer.from(chiperText.iv, 'base64');

    const encryptedText = Buffer.from(chiperText.encryptedData, 'base64');
    const decipher = Crypto.createDecipheriv(CRYPTING_ALGORITM, Buffer.from(KEY, 'base64'), iv);

    // let decrypted = decipher.update(encryptedText);

    const auth = Buffer.from(chiperText.auth, 'base64');
    decipher.setAuthTag(auth);

    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

    return decrypted.toString();
};

module.exports = {
    GenNumberCode: genNumberCode,
    GenHashPassword: genHashPassword,
    VerifyHashPassword: verifyHashPassword,

    Encrypt: encrypt,
    Decrypt: decrypt,
};
