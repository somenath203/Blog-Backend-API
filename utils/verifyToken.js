const jwt = require('jsonwebtoken');


const verifyToken = (token) => {

    return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userDecoded) => {
        if(err) {

            return false;

        } else {

            return userDecoded;
            
        }
    });

};


module.exports = verifyToken;