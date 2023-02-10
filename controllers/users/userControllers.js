const bcrypt = require('bcryptjs');

const User = require('../../models/User/User');
const generateToken = require('../../utils/generateToken');
const appError = require('../../utils/appError');
const Post = require('../../models/Post/Post');
const Comment = require('./../../models/Comment/Comment');
const Category = require('./../../models/Category/Category');


const userRegister = async (req, res, next) => {

    const { firstname, lastname, email, password } = req.body;

    try {

        const userFound = await User.findOne({ email: email });

        if (userFound) {

            return next(appError('user with this emailID already exists', 409));

        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);


        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            status: 'success',
            message: 'you have registered successfully',
            data: user
        });

    } catch (error) {

        next(appError(error.message));

    };

};


const userLogin = async (req, res, next) => {

    const { email, password } = req.body;

    try {

        const userFound = await User.findOne({ email: email });

        if (!userFound) {

            return next(appError('Invalid Credentials. Please try again', 401));

        }

        const isPasswordMatched = await bcrypt.compare(password, userFound.password);

        if (!isPasswordMatched) {

            return next(appError('Invalid Credentials. Please try again', 401));

        }

        res.status(200).json({
            success: true,
            message: 'you have logged in successfully',
            data: {
                firstname: userFound.firstname,
                lastname: userFound.lastname,
                email: userFound.email,
                isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id)
            }
        });

    } catch (error) {

        next(appError(error.message));


    }

};

const allUsers = async (req, res, next) => {

    try {

        const allUsers = await User.find();

        res.status(200).json({
            status: 'success',
            data: 'all users fetched successfully',
            totalNumberOfUsers: allUsers.length,
            allUsers
        });

    } catch (error) {

        next(appError(error.message));

    };

};

const userProfile = async (req, res, next) => {

    try {

        const user = await User.findById(req.user);

        if (!user) {

            return next(appError('user does not exist', 401));

        }

        res.status(200).json({
            status: 'success',
            message: 'you have fetched your profile successfully',
            data: user
        });

    } catch (error) {

        next(appError(error.message));

    };

};

const deleteUser = async (req, res, next) => {

    try {

        const userToBeDeleted = await User.findById(req.user);

        await Post.deleteMany({ user: userToBeDeleted });

        await Comment.deleteMany({ user: userToBeDeleted });

        await Category.deleteMany({ user: userToBeDeleted });

        await userToBeDeleted.delete();


        res.status(200).json({
            status: 'success',
            data: 'your account has been deleted successfully'
        });


    } catch (error) {

        next(appError(error.message));

    };

};


const updateUser = async (req, res, next) => {

    try {

        const { firstname, lastname, email } = req.body;

        if (email) {

            const emailTaken = await User.findOne({ email });

            if (emailTaken) {

                next(appError('email already taken', 400));

            }

        }

        const user = await User.findByIdAndUpdate(req.user, { firstname, lastname, email }, { new: true, runValidators: true });


        res.status(200).json({
            status: 'success',
            message: 'you have updated your profile successfully',
            updatedUser: user
        });


    } catch (error) {

        next(appError(error.message));

    };

};


const updatePassword = async (req, res, next) => {

    try {

        const { password } = req.body;

        if (!password) {

            next(appError('please provide a password', 401));

        }


        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);


        await User.findByIdAndUpdate(req.user, { password: hashedPassword }, { new: true });


        res.status(200).json({
            success: true,
            message: 'your password is updated successfully'
        });


    } catch (error) {

        next(appError(error.message));

    };

};


const profilePhotoUpload = async (req, res, next) => {

    try {

        const userToBeUpdated = await User.findById(req.user);


        if (!userToBeUpdated) {

            return next(appError('no user found', 404));

        }

        if (userToBeUpdated.isBlocked) {

            return next(appError('action not allowed since your account is blocked', 401));

        }

        if (req.file) {

            const updatedUser = await User.findByIdAndUpdate(req.user, { $set: { profilePhoto: req.file.path } }, { new: true });

            res.status(200).json({
                status: 'success',
                message: 'your profile photo is uploaded successfully',
                data: updatedUser
            });

        }

    } catch (error) {

        next(appError(error.message));

    };

};


const viewOthersProfile = async (req, res, next) => {

    try {

        const user = await User.findById(req.params.id);

        const userWhoViewd = await User.findById(req.user);

        if (user && userWhoViewd) {

            const isUserAlreadyAExistingViewer = user.viewers.find((viewer) =>
                viewer.toString() === userWhoViewd._id.toString()
            );

            if (isUserAlreadyAExistingViewer) {

                return next(appError('you already viewed this profile'));

            }

            user.viewers.push(userWhoViewd._id);

            await user.save();

            res.status(200).json({
                success: true,
                message: `you have successfully viewed the profile of ${user.firstname + " " + user.lastname}`
            });

        } else {

            return next(appError('both the user and the viewer does not exist', 404));

        }

    } catch (error) {

        next(appError(error.message));

    }


};


const userFollowing = async (req, res, next) => {

    try {

        const userToFollow = await User.findById(req.params.id);

        const userWhoIsFollowing = await User.findById(req.user);

        if (userToFollow && userWhoIsFollowing) {

            const isUserAlreadyInFollowersList = userToFollow.followers.find((follower) =>
                follower.toString() === userWhoIsFollowing._id.toString()
            )


            if (isUserAlreadyInFollowersList) {

                return next(appError('you are already following this user'));

            }

            userToFollow.followers.push(userWhoIsFollowing._id);

            userWhoIsFollowing.following.push(userToFollow._id);


            await userToFollow.save();

            await userWhoIsFollowing.save();


            res.status(200).json({
                success: true,
                message: `you started following ${userToFollow.firstname} ${userToFollow.lastname}`
            });

        } else {

            return next(appError('either of the user does not exists', 404));

        }


    } catch (error) {

        next(appError(error.message));

    };

};


const unFollowUser = async (req, res, next) => {

    try {

        const userToBeUnfollowed = await User.findById(req.params.id);

        const userWhoIsUnfollowing = await User.findById(req.user);


        if (userToBeUnfollowed && userWhoIsUnfollowing) {

            const isUserAlreadyInFollowersList = userToBeUnfollowed.followers.find((follower) =>
                follower.toString() === userWhoIsUnfollowing._id.toString()
            );

            if (!isUserAlreadyInFollowersList) {

                return next(appError('you have already unfollowed the user'));

            }


            userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter((follower) => (
                follower.toString() !== userWhoIsUnfollowing._id.toString()
            ));


            userWhoIsUnfollowing.following = userWhoIsUnfollowing.following.filter((following) =>
                following.toString() !== userToBeUnfollowed._id.toString()
            );


            await userToBeUnfollowed.save();

            await userWhoIsUnfollowing.save();


            res.status(200).json({
                success: true,
                message: `you have successfully unfollowed ${userToBeUnfollowed.firstname} ${userToBeUnfollowed.lastname}`
            });


        } else {

            return next(appError('either of the user does not exists', 404));

        }

    } catch (error) {

        next(appError(error.message));

    }

};


const blockUser = async (req, res, next) => {

    try {

        const userToBeBlocked = await User.findById(req.params.id);

        const userWhoIsBlocking = await User.findById(req.user);

        if (userToBeBlocked && userWhoIsBlocking) {

            const isUserAlreadyBlocked = userWhoIsBlocking.blocked.find((user) =>
                user._id.toString() === userToBeBlocked._id.toString()
            );

            if (isUserAlreadyBlocked) {

                return next(appError('you have already blocked this user'));

            }


            userWhoIsBlocking.blocked.push(userToBeBlocked._id);

            await userWhoIsBlocking.save();


            res.status(200).json({
                success: true,
                message: `you have successfully blocked ${userToBeBlocked.firstname} ${userToBeBlocked.lastname}`
            });


        } else {

            return next(appError('either of the user does not exists', 404));

        }


    } catch (error) {

        next(appError(error.message));

    };

};


const unblockUser = async (req, res, next) => {

    try {

        const userToBeUnblocked = await User.findById(req.params.id);

        const userWhoIsUnblocking = await User.findById(req.user);

        if (userToBeUnblocked && userWhoIsUnblocking) {

            const isUserExistsInArrayOfBlockedUser = userWhoIsUnblocking.blocked.find((user) =>
                user._id.toString() === userToBeUnblocked._id.toString()
            );

            if (!isUserExistsInArrayOfBlockedUser) {

                return next(appError('you have already un-blocked this user'));

            }


            userWhoIsUnblocking.blocked = userWhoIsUnblocking.blocked.filter((user) =>
                user._id.toString() !== userToBeUnblocked._id.toString()
            )

            await userWhoIsUnblocking.save();

            res.status(200).json({
                success: false,
                message: `you have successfully unblocked ${userToBeUnblocked.firstname} ${userToBeUnblocked.lastname}`
            });


        } else {

            return next(appError('either of the user does not exists', 404));

        }

    } catch (error) {

        next(appError(error.message));

    };

};


const adminBlockedUser = async (req, res, next) => {

    try {

        const userToBeBlockedByAdmin = await User.findById(req.params.id);

        if (!userToBeBlockedByAdmin) {

            return next(appError('user to be blocked is not available', 404));

        }

        userToBeBlockedByAdmin.isBlocked = true;

        await userToBeBlockedByAdmin.save();


        res.status(200).json({
            success: true,
            message: `admin has successfully blocked ${userToBeBlockedByAdmin.firstname} ${userToBeBlockedByAdmin.lastname}`,
        });


    } catch (error) {

        next(appError(error.message));

    };

};


const adminUnBlockedUser = async (req, res, next) => {

    try {

        const userToBeUnBlockedByAdmin = await User.findById(req.params.id);

        if (!userToBeUnBlockedByAdmin) {

            return next(appError('user to be blocked is not available', 404));

        }

        userToBeUnBlockedByAdmin.isBlocked = false;

        await userToBeUnBlockedByAdmin.save();


        res.status(200).json({
            success: true,
            message: `admin has successfully un-blocked ${userToBeUnBlockedByAdmin.firstname} ${userToBeUnBlockedByAdmin.lastname}`
        });


    } catch (error) {

        next(appError(error.message));

    };

};


module.exports = {
    userRegister,
    userLogin,
    allUsers,
    userProfile,
    deleteUser,
    updateUser,
    updatePassword,
    profilePhotoUpload,
    viewOthersProfile,
    userFollowing,
    unFollowUser,
    blockUser,
    unblockUser,
    adminBlockedUser,
    adminUnBlockedUser
}