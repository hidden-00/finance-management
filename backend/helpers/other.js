const crypto = require('crypto');

const otherHelper = {};

otherHelper.generateRandomHexString = (len) => {
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len)
        .toUpperCase(); // return required number of characters
};

module.exports = otherHelper;