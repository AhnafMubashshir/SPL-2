const express = require('express');
const router = express.Router();

const { Likes } = require('../models');
const { Users } = require('../models');
const { Posts } = require('../models');

async function getUserbyID (uID) {
    const user = await Users.findOne({
        where: {
            userID: uID
        }
    })

    console.log("its the user: ", user.name);

    return user
}

router.post('/postLikeOperation', async (req, res) => {
    const postID = req.body.postID;
    const uID = req.body.uID.uID;
    var postliked = false;

    const post = await Posts.findOne({
        where: {
            id: postID
        }
    })

    console.log("like counts: ",post.likeCount);

    const postLike = await Likes.findOne({
        where: {
            postID: postID,
            userID: uID,
        },
    });

    if(!postLike){
        const user = await getUserbyID(uID);
        // console.log("User NAme: ............ ",user.name);

        const newPostLike = {
            postID: postID,
            userID: user.userID,
            userName: user.name,
            liked: true,
        }

        post.likeCount = post.likeCount + 1;

        postliked = true;

        console.log("like counts: ", post.likeCount);

        await post.save();

        await Likes.create(newPostLike);
    }
    else {
        if(postLike.liked){
            post.likeCount = post.likeCount-1;
            postLike.liked = false;
            postliked = false;

            await post.save();
            await postLike.save();
        }
        else {
            post.likeCount = post.likeCount+1;
            postLike.liked = true;

            postliked = true;

            await post.save();
            await postLike.save();
        }
    }

    res.json({likeCount: post.likeCount, liked: postliked});
    

})

module.exports = router;