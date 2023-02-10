const getTokenFromheader = require('../utils/getTokenFromHeader');
const verfiedToken = require('../utils/verifyToken');
const appError = require('../utils/appError');
const User = require('../models/User/User');


const isAdmin = async (req, res, next) => {

    const token = getTokenFromheader(req);

    const decodedUser = verfiedToken(token);

    if (!decodedUser) {

        return next(appError('Invalid/Expired token. Please login again!!', 401));

    } else {

        const user = await User.findById(decodedUser.userId);

        if(user.isAdmin) {

            return next();

        } else {

            return next(appError('You don\'t have access to this action since you are not the admin', 403))

        }

    }


};


module.exports = isAdmin;

