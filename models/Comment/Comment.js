const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
        required: [true, 'please describe your comment']
    }
}, {
    timestamps: true
});


const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;


