require('dotenv').config();
module.exports = {
    PORT: process.env.PORT || 3300,
    JWT_SECRET: process.env.JWT_SECRET || "shhh",
    NODE_ENV: process.env.NODE_ENV || "development",
    BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 8
};