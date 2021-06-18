const User = require('../users/user-model');

function checkPayload(req, res, next) {
    next();
}

function checkCredentials(req, res, next) {
    next();
}

module.exports = {
    checkCredentials,
    checkPayload
};