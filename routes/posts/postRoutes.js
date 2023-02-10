const express = require('express');

const postRouters = express.Router();


const {
    createNewPost,
    getAllPosts,
    deletePost,
    updatePost,
    toggleLikePost,
    toggleDisLikePost,
    getParticularPostAndViewsOnPost
} = require('../../controllers/posts/postControllers');
const isAuthenticated = require('./../../middlewares/isAuthenticated');
const cloudinaryStorage = require('../../config/cloudinary');


const multer = require('multer');

const upload = multer({ storage: cloudinaryStorage });


// POST/api/v1/posts
postRouters.post('/', isAuthenticated, upload.single('postImage'), createNewPost);

// GET/api/v1/posts
postRouters.get('/', isAuthenticated, getAllPosts);

// DELETE/api/v1/posts/:id
postRouters.delete('/:id', isAuthenticated, deletePost);

// PUT/api/v1/posts/:id
postRouters.put('/:id', isAuthenticated, upload.single('postImage'), updatePost);

// GET/api/v1/posts/likes/:id
postRouters.get('/likes/:id', isAuthenticated, toggleLikePost);

// GET/api/v1/posts/dislikes/:id
postRouters.get('/dislikes/:id', isAuthenticated, toggleDisLikePost);

// GET/api/v1/posts/:id
postRouters.get('/:id', isAuthenticated, getParticularPostAndViewsOnPost);



module.exports = postRouters;