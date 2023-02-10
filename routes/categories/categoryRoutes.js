const express = require('express');


const categoryRouters = express.Router();


const {
    createNewCategory,
    getParticularCategory,
    deleteCategory,
    updateCategory,
    fetchAllCategories
} = require('../../controllers/categories/categoryControllers');
const isAuthenticated = require('./../../middlewares/isAuthenticated');


// POST/api/v1/categories
categoryRouters.post('/', isAuthenticated, createNewCategory);

// GET/api/v1/categories
categoryRouters.get('/', isAuthenticated, fetchAllCategories);

// GET/api/v1/categories/:id
categoryRouters.get('/:id', isAuthenticated, getParticularCategory);


// DELETE/api/v1/category/:id
categoryRouters.delete('/:id', isAuthenticated, deleteCategory);

// PUT/api/v1/category/:id
categoryRouters.put('/:id', isAuthenticated, updateCategory);



module.exports = categoryRouters;