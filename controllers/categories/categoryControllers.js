const Category = require('./../../models/Category/Category');
const appError = require('../../utils/appError');


const createNewCategory = async (req, res, next) => {

    try {

        const { title } = req.body;


        if (await Category.findOne({ title: title })) {

            return next(appError(`"${title}" already exists as a category.`));

        }


        const createCategory = await Category.create({ title: title, user: req.user });


        res.status(201).json({
            status: 'success',
            data: 'you have posted your category successfully',
            category: createCategory
        });


    } catch (error) {

        next(appError(error.message));

    };

};


const fetchAllCategories = async (req, res, next) => {

    try {

        const getAllCategories = await Category.find();

        res.status(200).json({
            success: false,
            message: 'successfully fetched all categories',
            totalNumberOfCategories: getAllCategories.length,
            allCategories: getAllCategories
        });

    } catch (error) {

        next(appError(error.message));

    };

};


const getParticularCategory = async (req, res, next) => {

    try {

        const category = await Category.findbyId(req.params.id);

        if (!category) {

            return next(appError('unable to find this category'));

        };

        res.status(200).json({
            status: 'success',
            data: `category with ID ${category._id} has been fetched successfully`,
            category
        });

    } catch (error) {

        next(appError(error.message));

    };

};


const deleteCategory = async (req, res, next) => {

    try {

        const category = await Category.findById(req.params.id);
        

        if(category?.user?._id.toString() !== req?.user) {

            return next(appError('you are not authorized to delete this category', 401));

        }

        if (!category) {

            return next(appError('unable to find this category'));

        };


        await Category.findOneAndDelete({ _id: req.params.id, user: req.user });


        res.status(200).json({
            status: 'success',
            data: `category with ID ${req.params.id} is deleted successfully`
        });

    } catch (error) {

        next(appError(error.message));

    };

};

const updateCategory = async (req, res, next) => {

    try {

        const { title } = req.body;

        const getCategory = await Category.findById(req.params.id);

        if(getCategory?.user?._id.toString() !== req?.user) {

            return next(appError('you are not authorized to edit this category', 401));

        }

        if (!getCategory) {

            return next(appError('unable to find this category'));

        };


        const categoryUpdated = await Category.findOneAndUpdate({ _id: req.params.id, user: req.user }, { title: title }, { new: true, runValidators: true });


        res.status(200).json({
            status: 'success',
            data: 'your category is updated successfully',
            updatedCategory: categoryUpdated
        });


    } catch (error) {

        next(appError(error.message));

    };

};


module.exports = {
    createNewCategory,
    getParticularCategory,
    fetchAllCategories,
    deleteCategory,
    updateCategory
}