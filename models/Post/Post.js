const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'please provide title for your post'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'please provide description for your post']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    numViews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    photo: {
        type: String,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});


postSchema.pre(/^find/, function (next) {

    postSchema.virtual('totalViewsOnThePost').get(function () {

        return this.numViews.length;

    });


    next();

});



postSchema.pre(/^find/, function (next) {

    postSchema.virtual('totalNumberOfLikes').get(function () {

        return this.likes.length;

    });

    postSchema.virtual('totalNumberOfDisLikes').get(function () {

        return this.dislikes.length;

    });


    postSchema.virtual('numberOfDaysAgoThePostWasCreated').get(function () {

        const dateAtWhichPostWasCreated = new Date(this?.createdAt);

        const daysAgo = Math.floor((Date.now() - dateAtWhichPostWasCreated) / 86400000);

        return daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days`;

    });


    next();

});



const Post = mongoose.model('Post', postSchema);

module.exports = Post; 