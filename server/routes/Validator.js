const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const AuthService = require('../AuthService');
const { Users } = require('../models');

router.post('/createUserID', (req, res) => {
    const userID = crypto.randomBytes(32).toString('hex');
    return res.send({ userID });
})

router.post('/checkValidation', async (req, res) => {
    const token = req.body.token;
    const userID = req.body.userID.uID;
    var trainModelAccess = false;

    const user = await Users.findOne({
        where: {
            userID: userID
        },
        attributes: ['userType'],
    });

    if (user.userType === 'AU') {
        trainModelAccess = true;
    }

    console.log(trainModelAccess);
    try {
        const sign = AuthService.isAuthenticated(token, userID);
        console.log('sent');
        return res.send({sign: sign, trainModelAccess: trainModelAccess});
    } catch (err) {
        console.error("wont be sent");
        return res.status(500).send('Internal server error');
    }
})

module.exports = router;

