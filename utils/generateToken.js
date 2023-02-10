const jwt = require('jsonwebtoken');


const generateToken = (id) => {

    return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRES_IN });

};


module.exports = generateToken;