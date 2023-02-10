const getTokenFromheader = require('../utils/getTokenFromHeader');
const verfiedToken = require('../utils/verifyToken');
const appError = require('../utils/appError');


const isAuthenticated = (req, res, next) => {

    const token = getTokenFromheader(req);

    const decodedUser = verfiedToken(token);

    if (!decodedUser) {

        return next(appError('Invalid/Expired token. Please login again!!', 401))

    } else {

        req.user = decodedUser.userId;

        next();

    }


};


module.exports = isAuthenticated;