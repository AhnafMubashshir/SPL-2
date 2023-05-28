const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

const { Chats } = require('../models');
const { Users } = require('../models');

router.get('/getUIDs', async (req, res) => {
    console.log('Came here.');
    const excludedUserID = '80313';

    const users = await Users.findAll({
        where: {
            userID: {
                [Op.ne]: excludedUserID,
            },
        },
        attributes: ['userID', 'name'],
    });

    res.json(users);
});

router.post('/createChat', async (req, res) => {
    const message = req.body.message;
    const userID = req.body.userID;
    var userType = req.body.userType;

    if (userType === 'AU') {
        userType = 'ADMIN';
    }
    else if (userType === 'GU') {
        userType = 'USER';
    }

    console.log(message, userID, userType);

    const newChat = {
        userID: userID,
        sender: userType,
        message: message,
    };

    await Chats.create(newChat);

    res.json({ message: 'Chat pushed' });
})

router.post('/getChats', async (req, res) => {
    const userID = req.body.uID;

    const chats = await Chats.findAll({
        where: {
            userID: userID
        }
    });

    const user = await Users.findOne({
        where: {
            userID: userID
        },
        attributes: ['name']
    });

    res.json({chats: chats, userName: user.name});
})

module.exports = router;