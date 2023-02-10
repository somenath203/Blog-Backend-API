const express = require('express');
const multer = require('multer');

const userRouters = express.Router();

const {
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
} = require('../../controllers/users/userControllers');
const isAuthenticated = require('../../middlewares/isAuthenticated');
const cloudinaryStorage = require('../../config/cloudinary');
const isAdmin = require('./../../middlewares/isAdmin');


const upload = multer({ storage: cloudinaryStorage });


// POST/api/v1/users/register
userRouters.post('/register', userRegister);

// POST/api/v1/users/login
userRouters.post('/login', userLogin);

// GET/api/v1/users/profile/:id
userRouters.get('/profile', isAuthenticated, userProfile);

// GET/api/v1/users
userRouters.get('/', allUsers);

// DELETE/api/v1/users
userRouters.delete('/', isAuthenticated, deleteUser);

// PUT/api/v1/users
userRouters.put('/', isAuthenticated, updateUser);

// PUT/api/v1/users/update-password
userRouters.put('/update-password', isAuthenticated, updatePassword);

// POST/api/v1/users/profile-photo-upload
userRouters.post('/profile-photo-upload', isAuthenticated, upload.single('profile'), profilePhotoUpload);

// GET/api/v1/users/profile-viewers/:id
userRouters.get('/profile-viewers/:id', isAuthenticated, viewOthersProfile);

// GET/api/v1/users/following/:id
userRouters.get('/following/:id', isAuthenticated, userFollowing);

// GET/api/v1/users/un-follow/:id
userRouters.get('/un-follow/:id', isAuthenticated, unFollowUser);

// GET/api/v1/users/blocked/:id
userRouters.get('/blocked/:id', isAuthenticated, blockUser);

// GET/api/v1/users/blocked/:id
userRouters.get('/un-blocked/:id', isAuthenticated, unblockUser);

// PUT/api/v1/users/admin-block/:id
userRouters.put('/admin-block/:id', isAuthenticated, isAdmin, adminBlockedUser);

// PUT/api/v1/users/admin-unblock/:id
userRouters.put('/admin-unblock/:id', isAuthenticated, isAdmin, adminUnBlockedUser);



module.exports = userRouters;


