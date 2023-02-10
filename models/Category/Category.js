const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});


const categoryModel = mongoose.model('Category', categorySchema);


module.exports = categoryModel;


