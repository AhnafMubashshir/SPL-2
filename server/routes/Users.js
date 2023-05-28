const express = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const AuthService = require('../AuthService')
const router = express.Router()
const { Users } = require('../models')
const { Posts } = require('../models');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');
const fs = require('fs');


async function generateUniqueID() {
    console.log('generating uID.');
    const min = 10000; // Minimum 5-digit number
    const max = 99999; // Maximum 5-digit number
    const UID = Math.floor(Math.random() * (max - min + 1) + min);

    // Check if this UID exists in the database
    const user = await Users.findOne({ where: { userID: UID } });

    if (!user) {
        // If the user doesn't exist, UID is unique, return it
        return UID;
    } else {
        // If the user does exist, recursively call this function again
        return generateUniqueID();
    }
}

// generate hashed password when sign up
function generateHashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    return hashedPassword;
}

// Generates token for log in
function generateToken(userID) {
    const token = jwt.sign({ userID }, 'Hello World', { expiresIn: '2h' });
    return token;
  }

router.post('/generateUserID', async (req, res) => {
    try {
        const uID = await generateUniqueID();
        res.send({ uID: uID });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
})


// login method
router.post('/checkPassword', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // console.log(email, password);

    const user = await Users.findOne({
        where: { email },
        attributes: ['name', 'companyName', 'email', 'country', 'phoneNumber', 'password', 'userID', 'userType', 'createdAt', 'updatedAt']
    });

    // console.log('Newly generated password: ', bcrypt.compareSync(password, user.password));
    // console.log('old password: ', user.password);

    if (user) {
        const userID = user.userID;
        const userType = user.userType;
        const hashedPassword = user.password;
        const isMatch = bcrypt.compareSync(password, hashedPassword);

        if (isMatch) {
            // console.log("in here.......................Thanks");
            const token = generateToken(user);
            return res.send({ sign: true, token, userID, userType });
        } else {
            return res.send({ sign: false });
        }
    } else {
        return res.send({ sign: false });
    }
});



router.post('/uIDSearch', async (req, res) => {
    const uID = req.body.uID;

    const user = await Users.findOne({
        where: { userID: uID },
        attributes: ['name', 'companyName', 'email', 'country', 'phoneNumber', 'userID', 'userType']
    });

    res.json(user);
})


// signup method
router.post('/signUp', async (req, res) => {
    const user = req.body;

    console.log(user.formValues.name);
    console.log(user.userID);
    console.log(user.userType);



    const hashedPassword = generateHashPassword(user.formValues.password);
    const isMatch = bcrypt.compareSync(user.formValues.password, hashedPassword);

    if (isMatch) {

        const newUser = {
            name: user.formValues.name,
            companyName: user.formValues.companyName,
            email: user.formValues.email,
            country: user.formValues.country,
            phoneNumber: user.formValues.phoneNumber,
            password: hashedPassword,
            userID: user.userID,
            userType: user.userType,
        };

        await Users.create(newUser);
        res.json(user);
    }
    else {
        res.send('error');
    }
})

router.post('/update', async (req, res) => {
    const user = req.body;

    console.log(user);

    try {
        const updatedUser = await Users.findByPk(user.email);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the post properties
        updatedUser.name = user.name;
        updatedUser.companyName = user.companyName;
        updatedUser.phoneNumber = user.phoneNumber;

        // Save the updated post
        await updatedUser.save();

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/updatePassword', async (req, res) => {
    const userEmail = req.body.email;
    const newPassword = req.body.newPassword;

    console.log("...................", newPassword);

    try {
        // Find the user by email
        const user = await Users.findOne({ where: { email: userEmail } });
        console.log("...................", user.password);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log("...................", user.password);

        user.password = generateHashPassword(newPassword);

        console.log("...................", user.password);

        await user.save();


        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/delete', async (req, res) => {
    const userEmail = req.body.email;

    try {
        // Find the user by email
        const user = await Users.findOne({ where: { email: userEmail } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find and delete the user's posts
        await Posts.destroy({ where: { userName: user.name } });

        // Delete the user
        await user.destroy();

        res.json({ message: 'User and associated posts deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/checkEmail', async (req, res) => {
    const email = req.body.email;

    const user = await Users.findOne({
        where: {
            email: email
        },
        attributes: ['userType'],
    });

    console.log(user===null);

    if (user === null) {
        res.json({sign: false});
    }
    else {
        res.json({sign: true});
    }
})

module.exports = router;