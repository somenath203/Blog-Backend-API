const express = require('express');

const commentRouters = express.Router();


const {
    postNewComment,
    deleteComment,
    updateComment
} = require('../../controllers/comments/commentControllers');
const isAuthenticated = require('./../../middlewares/isAuthenticated');


// POST/api/v1/comments/:id
commentRouters.post('/:id', isAuthenticated, postNewComment);

// DELETE/api/v1/comments/:id
commentRouters.delete('/:id', isAuthenticated, deleteComment);


// PUT/api/v1/comments/:id
commentRouters.put('/:id', isAuthenticated, updateComment);


module.exports = commentRouters;