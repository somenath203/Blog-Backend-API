const Post = require('./../../models/Post/Post');
const Comment = require('./../../models/Comment/Comment');
const User = require('./../../models/User/User');
const appError = require('../../utils/appError');


const postNewComment = async (req, res, next) => {

    try {

        const { description } = req.body;

        const postToCommentOn = await Post.findById(req.params.id);

        if(!postToCommentOn) {

            return next(appError('post you want to comment on is either already deleted or not available'));

        }

        const userWhoWillCommentOnThePost = await User.findById(req.user);

        const comment = await Comment.create({ post: postToCommentOn._id, description: description, user: userWhoWillCommentOnThePost });

        postToCommentOn.comments.push(comment._id);

        userWhoWillCommentOnThePost.commentsMadeByUserOnAnyPosts.push(comment._id);

        await postToCommentOn.save();

        await userWhoWillCommentOnThePost.save();


        res.status(201).json({
            status: 'success',
            data: `you have posted your comment successfully on the post "${postToCommentOn.title}"`,
            yourComment: description
        });

    } catch (error) {

        next(appError(error.message));

    };

};


const deleteComment = async (req, res, next) => {

    try {

        const commentToBeDeleted = await Comment.findById(req.params.id);

        if(!commentToBeDeleted) {

            return next(appError('comment you want to delete is either already deleted or not available'));

        }

        const userWhoWantsToDeleteTheComment = await User.findById(req.user);


        if(commentToBeDeleted?.user?._id?.toString() !== userWhoWantsToDeleteTheComment?._id?.toString()) {

            return next(appError('you are not authorized to delete this comment'));

        }


        const isCommentStillExistsInTheUsersArray = userWhoWantsToDeleteTheComment.commentsMadeByUserOnAnyPosts.find((comment) => 
        
            comment._id.toString() === commentToBeDeleted._id.toString()

        );

        if(!isCommentStillExistsInTheUsersArray) {

            return next(appError('you have already deleted this comment'));

        }

        userWhoWantsToDeleteTheComment.commentsMadeByUserOnAnyPosts = userWhoWantsToDeleteTheComment.commentsMadeByUserOnAnyPosts.filter((comment) => 

          comment._id.toString() !== commentToBeDeleted._id.toString()

        );

        await userWhoWantsToDeleteTheComment.save();


        const postFromWhichDeletedCommentToBeRemoved = await Post.findById(commentToBeDeleted.post);

        postFromWhichDeletedCommentToBeRemoved.comments = postFromWhichDeletedCommentToBeRemoved.comments.filter((comment) => 
          
           comment._id.toString() !== commentToBeDeleted._id.toString()

        );

        await postFromWhichDeletedCommentToBeRemoved.save();


        await commentToBeDeleted.delete();


        res.status(200).json({
            status: 'success',
            data: 'your comment has been deleted successfully'
        });

    } catch (error) {

        console.log(error);

        next(appError(error.message));

    };

};

const updateComment = async (req, res, next) => {

    try {

        const { description } = req.body;

        const commentToBeEdited = await Comment.findById(req.params.id);

        if(!commentToBeEdited) {

            return next(appError('comment you want to edit is either deleted or not available'));

        }

        const userWhoWantsToEditTheComment = await User.findById(req.user);

        if(commentToBeEdited?.user?._id?.toString() !== userWhoWantsToEditTheComment?._id?.toString()) {

            return next(appError('you are not authorized to edit this comment'));

        }

        const commentUpdated = await Comment.findByIdAndUpdate(req.params.id, { description }, { new: true, runValidators: true });


        res.status(200).json({
            status: 'success',
            data: 'your comment has been updated successfully',
            updatedComment: commentUpdated
        });

    } catch (error) {

        next(appError(error.message));

    };

};


module.exports = {
    postNewComment,
    deleteComment,
    updateComment
}