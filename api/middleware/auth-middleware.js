const Users = require('../users/user-model');

const bcrypt = require('bcryptjs');

const tokenBuilder = require('../auth/token-builder');

async function checkPayload(req, res, next) {
    const { username, password } = req.body;

    if (
        !username ||
        !username.trim() ||
        !password ||
        !password.trim()
    ) {
        next({
            status: 400,
            message: "username and password required"
        });

    } else {
        next();
    }
}

function checkUsername(req, res, next) {
    const { username, password } = req.body;

    Users.findBy({ username })
        .then(([user]) => {
            if (user) {
                next({
                    status: 409,
                    message: "username taken"
                });
            } else {
                const rounds = Number(process.env.BCRYPT_ROUNDS) || 8;
                req.hash = bcrypt.hashSync(password, rounds);
                next();
            }
        })
        .catch(next);
}

function checkCredentials(req, res, next) {
    const { username, password } = req.body;

    Users.findBy({ username })
        .then(([user]) => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.token = tokenBuilder(user);
                next();
            } else {
                next({
                    status: 401,
                    message: 'Invalid credentials'
                });
            }
        })
        .catch(next);
}

module.exports = {
    checkCredentials,
    checkUsername,
    checkPayload
};
