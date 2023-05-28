const express = require('express')
const router = express.Router()
const { Posts } = require('../models')
const { Users } = require('../models')

async function collectUserName(userID){
    const user = await Users.findOne({
        where: {
            userID: userID
        },
        attributes: ['name'],
    });
    return user.name;
}

router.get('/', async (req, res) => {
    // console.log("............I can to collect all the posts.............");
    const allPosts = await Posts.findAll({
        order: [
            ['id', 'DESC']
        ]
    });
    // console.log(allPosts)
    res.json(allPosts);
})

router.post('/ownPosts', async (req, res) => {
    const userName = await collectUserName(req.body.userID.uID);

    const allPosts = await Posts.findAll({
        where: {
            userName: userName
        },
        order: [
            ['id', 'DESC']
        ]
    });

    res.json(allPosts);
})

router.post('/', async (req, res) => {
    const post = req.body.post;
    const userID = req.body.userID;

    console.log(post)

    const userName = await collectUserName(userID);

    // console.log(userName);

    const newPost = {
        title: post.title,
        body: post.body,
        userName: userName, 
        userID: userID,
    }

    await Posts.create(newPost);

    res.json(post);
})

router.post('/update', async (req, res) => {
    const prevPost = req.body;

    try {
        const newPost = await Posts.findByPk(prevPost.id);
        if (!newPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Update the post properties
        newPost.title = prevPost.title;
        newPost.body = prevPost.body;

        // Save the updated post
        await newPost.save();

        res.json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/deletePost', async (req, res) => {
    const postTODelete = req.body.post;

    const post = await Posts.findOne({
        where: {
            id: postTODelete.id
        }
    })

    await post.destroy();

    res.send('Post deleted');
})

module.exports = router;