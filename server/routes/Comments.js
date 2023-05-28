const express = require('express');
const router = express.Router();

const { Comments } = require('../models');
const { Users } = require('../models');
const { Posts } = require('../models');

async function getUserbyID(uID) {
    const user = await Users.findOne({
        where: {
            userID: uID
        }
    })

    console.log("its the user: ", user.name);

    return user;
}

router.post('/', async (req, res) => {
    // console.log("............I can to collect all the posts.............");
    const postID = req.body.postID;
    // console.log(req.body);
    const allComments = await Comments.findAll({
        where: {
            postID: postID
        },
        order: [
            ['id', 'DESC']
        ]
    });
    console.log(allComments)
    res.json(allComments);
})

router.post('/postCommentOperation', async (req, res) => {
    const uID = req.body.uID.uID;
    const comment = req.body.comment;
    const postID = req.body.postID;

    // console.log(uID, comment, req.body);

    const post = await Posts.findOne({
        where: {
            id: postID
        }
    })

    // console.log("Comment counts: ",post.commentCount);

    const user = await getUserbyID(uID);
    // console.log("User NAme: ............ ",user.name);

    const newPostComment = {
        postID: postID,
        body: comment,
        userID: user.userID,
        userName: user.name,
    }

    post.commentCount = post.commentCount + 1;

    console.log("Comment counts: ", post.commentCount);

    await post.save();

    await Comments.create(newPostComment);

    res.json({ commentCount: post.commentCount });
})

router.post('/deleteComment', async (req, res) => {
    const commentToBEDeleted = req.body.comment;

    console.log("comment to be deleted: ",commentToBEDeleted.postID);

    const comment = await Comments.findOne({
        where: {
            id: commentToBEDeleted.id
        }
    })

    const post = await Posts.findOne({
        where: {
            id: commentToBEDeleted.postID
        }
    })

    post.commentCount = post.commentCount - 1;

    console.log(post);

    await post.save();

    await comment.destroy();

    res.send('Comment deleted');
})

router.post('/editComment', async (req, res) => {
    const commentID = req.body.commentID;

    const commentBody = req.body.commentBody;

    const comment = await Comments.findOne({
        where: {
            id: commentID
        }
    });

    comment.body = commentBody;

    await comment.save();

    res.send('comment edited');
})


module.exports = router