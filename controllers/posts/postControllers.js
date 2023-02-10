const Post = require('./../../models/Post/Post');
const User = require('./../../models/User/User');
const appError = require('../../utils/appError');


const createNewPost = async (req, res, next) => {

    const { title, description, category } = req.body;

    try {

        const authorOfThePost = await User.findById(req.user);

        if (authorOfThePost.isBlocked) {

            return next(appError('your account is blocked for which you can\'t make any post. Please contact your admin.', 403));

        }

        const postCreated = await Post.create({
            title: title,
            description: description,
            category: category,
            user: authorOfThePost._id,
            photo: req?.file?.path
        });
        

        authorOfThePost.posts.push(postCreated);

        await authorOfThePost.save();


        res.status(201).json({
            status: 'success',
            data: 'you have created your post successfully',
            post: postCreated
        });


    } catch (error) {

        next(appError(error.message));

    };

};


const getAllPosts = async (req, res, next) => {

    try {


        const posts = await Post.find({}).populate('user').populate('category', 'title');


        const filteredPost = posts.filter((post) => {


            const blockedUsers = post.user.blocked;


            const isAuthenticatedUserBlocked = blockedUsers.includes(req.user);


            return isAuthenticatedUserBlocked ? null : post;


        });

        res.status(200).json({
            status: 'success',
            data: 'all posts fetched successfully',
            totalPosts: filteredPost.length,
            posts: filteredPost
        });


    } catch (error) {

        next(appError(error.message));

    };

};


const deletePost = async (req, res, next) => {

    try {

        const post = await Post.findById(req.params.id);


        if(post?.user?.toString() !== req?.user?.toString()) {

            return next(appError('you are not authorized to delete this post', 401));

        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            data: 'post deleted successfully'
        });


    } catch (error) {

        next(appError(error.message));

    };

};


const updatePost = async (req, res, next) => {

    try {

        const { title, description, category } = req.body;

        const post = await Post.findById(req.params.id);

        if(post?.user?.toString() !== req?.user) {

            return next(appError('you are not authorized to update this post', 401));

        }

        const updatePost = await Post.findByIdAndUpdate(req.params.id, { title, description, category, photo: req?.file?.path }, { new: true, runValidators: true });


        res.status(200).json({
            status: 'success',
            data: 'post updated successfully',
            updatedPost: updatePost
        });
        

    } catch (error) {

        next(appError(error.message));

    };

};


const toggleLikePost = async (req, res, next) => {

    try {

        const postToBeLiked = await Post.findById(req.params.id);

        if(!postToBeLiked) {

            return next(appError('post with this ID does not exist', 404));

        }

        const didUserAlreadyLikedThePost = postToBeLiked.likes.includes(req.user);

        if (!didUserAlreadyLikedThePost) {

            postToBeLiked.likes.push(req.user);

            await postToBeLiked.save();

            res.status(200).json({
                success: true,
                message: `you added like on the post "${postToBeLiked.title}"`
            });

        } else {

            postToBeLiked.likes = postToBeLiked.likes.filter((user) =>
                user._id.toString() !== req.user
            );

            await postToBeLiked.save();


            res.status(200).json({
                success: true,
                message: `you removed your like from the post "${postToBeLiked.title}"`
            });


        }

    } catch (error) {

        next(appError(error.message));

    };

};


const toggleDisLikePost = async (req, res, next) => {

    try {

        const postToBeDisLiked = await Post.findById(req.params.id);

        if(!postToBeDisLiked) {

            return next(appError('post with this ID does not exist', 404));
            
        }

        const didUserAlreadyDisLikedThePost = postToBeDisLiked.dislikes.includes(req.user);

        if (!didUserAlreadyDisLikedThePost) {

            postToBeDisLiked.dislikes.push(req.user);

            await postToBeDisLiked.save();

            res.status(200).json({
                success: true,
                message: `you disliked the post "${postToBeDisLiked.title}"`
            });

        } else {

            postToBeDisLiked.dislikes = postToBeDisLiked.dislikes.filter((user) =>
                user._id.toString() !== req.user
            );

            await postToBeDisLiked.save();


            res.status(200).json({
                success: true,
                message: `you removed your dislike from the post "${postToBeDisLiked.title}"`
            });


        }

    } catch (error) {

        next(appError(error.message));

    };

};


const getParticularPostAndViewsOnPost = async (req, res, next) => {

    try {

        const postToBeViewed = await Post.findById(req.params.id);

        if(!postToBeViewed) {

            return next(appError('post with this ID does not exist', 404));

        }

        const didUserPreviouslyViewedThePost = postToBeViewed.numViews.includes(req.user);

        if(!didUserPreviouslyViewedThePost) {

            postToBeViewed.numViews.push(req.user);

            await postToBeViewed.save();
            
        } else {

            return next(appError('you already viewed this post', 400));

        }


        res.status(200).json({
            status: 'success',
            data: 'post with particular ID fetched successfully',
            numberOfViewsOnThePost: postToBeViewed.numViews.length,
            post: postToBeViewed
        });

    } catch (error) {

        next(appError(error.message));

    };

};


module.exports = {
    createNewPost,
    getAllPosts,
    deletePost,
    updatePost,
    toggleLikePost,
    toggleDisLikePost,
    getParticularPostAndViewsOnPost
}