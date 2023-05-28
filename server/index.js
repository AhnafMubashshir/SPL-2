const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto')

const app = express();
app.use(express.json());
app.use(cors());

app.use(bodyParser.json())
app.use(express.json())

const multer = require('multer');
const upload = multer({ dest: '../Frontend/authentication/src/components/Headers/Admin' });
const path = require('path');
const fs = require('fs');


sgMail.setApiKey('');

const db = require('./models')

const postRouter = require('./routes/Posts');
const userRouter = require('./routes/Users');
const validatorRouter = require('./routes/Validator');
const likeRouter = require('./routes/Likes');
const commentRouter = require('./routes/Comments');
const vulnerabilityRouter = require('./routes/Vulnerability');
const ChatRouter = require('./routes/Chats');

app.use('/user', userRouter);

app.use('/posts', postRouter);

app.use('/validator', validatorRouter);

app.use('/like', likeRouter);

app.use('/comment', commentRouter);

app.use('/vulnerability', vulnerabilityRouter);

app.use('/chats', ChatRouter);

// app.post('/updatePost', async())

app.post('/test', (req, res) => {
    // Handle the POST request to /test
    // Perform any desired functionality here

    // Return a response
    res.status(200).json({ message: 'Test endpoint successful' });
});

app.post('/authentication', async (req, res) => {
    const email = req.body.email;

    // const otp = otpGenerator.generate(6, {
    //     numeric: true,
    //     alphabets: false,
    //     upperCase: false,
    //     specialChars: false
    //   });

    const otp = crypto.randomInt((1000, 9999)).toString()

    const msg = {
        to: email,
        from: 'svas2023AR@gmail.com',
        subject: 'OTP Verification',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <title>OTP Verification</title>
                <style type="text/css">
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        color: #333;
                        background-color: #f2f2f2;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 5px;
                        box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
                    }
                    h1 {
                        font-size: 24px;
                        font-weight: normal;
                        margin-top: 0;
                        margin-bottom: 20px;
                        text-align: center;
                    }
                    p {
                        margin-top: 0;
                        margin-bottom: 20px;
                        line-height: 1.5;
                    }
                    .otp-box {
                        display: inline-block;
                        padding: 10px;
                        border: 2px solid #ccc;
                        background-color: #f9f9f9;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>OTP Verification</h1>
                    <p>Thank you for choosing our service. As part of our security measures, we require that you verify your account with a one-time password (OTP).</p>
                    <p>
                        <div class="otp-box">${otp}</span>
                    </p>
                    <p>Please enter this OTP in the required field to complete your account verification.</p>
                    <p>If you did not request an OTP or believe that your account has been compromised, please contact us immediately at [insert contact information].</p>
                    <p>Thank you,</p>
                    <p><em>SVAS</em></p>
                </div>
            </body>
            </html>
        `
    };
    sgMail.send(msg);
    console.log(otp)

    res.send(otp);
})


// app.post('/pushVulnerability', (req, res) => {
//         // const AV: req.body.
//         // const AC: 
//         // const PR: 
//         // const UI: 
//         // const S: 
//         // const CI: 
//         // const II: 
//         // const AI: 
//         console.log("ser saying: ",req);

//         res.send(true)

// })

app.post('/uploadFile', upload.array('jsonFile'), (req, res) => {
    // Access the uploaded files
    const files = req.files;

    // Process each file and store in the database
    files.forEach((file) => {
        // Read the file data
        const fileData = fs.readFileSync(file.path, 'utf8');

        console.log(file);

        // Construct the new file name with .json extension
        const newFileName = file.originalname.replace(path.extname(file.originalname), '.json');

        // Check if the file with the same name already exists
        const existingFilePath = path.join('../Frontend/authentication/src/components/Headers/Admin', newFileName);
        if (fs.existsSync(existingFilePath)) {
            console.log(`File ${newFileName} already exists. Skipping...`);
            return; // Skip this file and move to the next one
        }

        // Write the file data to a new file with .json extension
        fs.writeFileSync(existingFilePath, fileData, 'utf8');
    });

    res.status(200).json({ message: 'File upload successful' });
});


db.sequelize.sync().then(() => {
    app.listen(5050, () => {
        console.log('Listening on port 5050.');
    })
})
