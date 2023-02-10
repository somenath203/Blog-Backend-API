const mongoose = require('mongoose');

const Post = require('./../Post/Post');


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'user must provide first name']
    },
    lastname: {
        type: String,
        required: [true, 'user must provide last name']
    },
    profilePhoto: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'user must provide email address'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'user must provide password']
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['Admin', 'Guest', 'Editor']
    },
    viewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    commentsMadeByUserOnAnyPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    blocked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    plan: {
        type: String,
        enum: ['Free', 'Premium', 'Pro'],
        default: 'Free'
    },
    userAward: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold'],
        default: 'Bronze'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});


userSchema.virtual('fullname').get(function () {
    return `${this.firstname} ${this.lastname}`;
});


userSchema.virtual('initials').get(function () {
    return `${this.firstname[0]}.${this.lastname[0]}.`;
});


userSchema.virtual('postCounts').get(function () {
    return this.posts.length;
});


userSchema.virtual('followersCount').get(function () {
    return this.followers.length;
});


userSchema.virtual('followingCount').get(function () {
    return this.following.length;
});


userSchema.virtual('viewersCount').get(function () {
    return this.viewers.length;
});


userSchema.virtual('blocksCount').get(function () {
    return this.blocked.length;
});


userSchema.pre('findOne', async function (next) {

    const idOfTheUser = this._conditions._id;

    const posts = await Post.find({ user: idOfTheUser });

    const lastPost = posts[posts.length - 1];

    const lastPostDate = new Date(lastPost?.createdAt).toDateString();

    userSchema.virtual('lastPostDate').get(function () {
        return lastPostDate;
    });


    const currentDate = new Date();

    const diffDate = currentDate - new Date(lastPost?.createdAt);

    const diffInDays = diffDate / (1000 * 3600 * 24);


    if (diffInDays > 30) {

        userSchema.virtual('isInactive').get(function () {

            return true;

        });

        const idOfTheUser = this._conditions._id;

        await User.findByIdAndUpdate(idOfTheUser, { isBlocked: true }, { new: true });


    } else {

        userSchema.virtual('isInactive').get(function () {

            return false;

        });

    }


    const daysAgo = Math.floor(diffInDays);


    userSchema.virtual('lastSeen').get(function () {

        if (daysAgo == 0) {

            return "Last Seen Today";

        } else if (daysAgo == 1) {

            return "Last seen yesterday";

        } else if (daysAgo > 1) {

            return `Last seen ${daysAgo}  days ago`;

        }

    });


    const totalNumberOfPosts = posts.length;

    if (totalNumberOfPosts <= 10) {

        await User.findByIdAndUpdate(idOfTheUser, { userAward: 'Bronze' }, { new: true });

    } else if (totalNumberOfPosts > 10 && totalNumberOfPosts <= 20) {

        await User.findByIdAndUpdate(idOfTheUser, { userAward: 'Silver' }, { new: true });

    } else if (totalNumberOfPosts > 20) {

        await User.findByIdAndUpdate(idOfTheUser, { userAward: 'Gold' }, { new: true });

    }


    
    this.populate('posts');


    next();

});



const User = mongoose.model('User', userSchema);


module.exports = User; 