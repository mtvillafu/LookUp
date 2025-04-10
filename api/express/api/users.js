require('express');
require('mongodb');
const { ObjectId } = require('mongodb');
require("dotenv").config();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const saltRounds = 10;
// Change this to domain which API is running on
const appName = 'http://localhost:3000';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

function generate6DigitCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken() {
    return crypto.randomBytes(16).toString('hex');
}

module.exports.setApp = function (app, client) {
    // Login API
    app.post('/api/login', async (req, res, next) => {
        let id = -1;
        let email = '';
        let username = '';
        let error = '';
        const login = req.body.login;
        const password = req.body.password;
        let db;

        try {
            db = client.db('app');
            resultsUsername = await db.collection('users').find({ username: login }).toArray();
            resultsEmail = await db.collection('users').find({ email: login }).toArray();
        } catch (e) {
            error = e.toString;
            let ret = { id: id, email: email, username: username, error: error };
            return res.status(500).json(ret);
        }


        if (resultsUsername.length > 0) { //Login matched a user's username
            const match = await bcrypt.compare(password, resultsUsername[0].password);
            if (match) { //Password matched
                isVerified = resultsUsername[0].isVerified;
                if(!isVerified){
                    error = "User is not verified"
                    let ret = { id: id, email: email, username: username, error: error };
                    return res.status(403).json(ret);
                }
                id = resultsUsername[0]._id;
                email = resultsUsername[0].email;
                username = resultsUsername[0].username;
                let ret = { id: id, email: email, username: username, error: error };
                return res.status(200).json(ret);
            } else { //Password did not match
                error = "password is wrong";
                let ret = { id: id, email: email, username: username, error: error };
                return res.status(401).json(ret);
            }
        } else if (resultsEmail.length > 0) { //Login matched a user's email
            const match = await bcrypt.compare(password, resultsEmail[0].password);
            if (match) { //Password matched
                isVerified = resultsEmail[0].isVerified;
                if(!isVerified){
                    error = "User is not verified"
                    let ret = { id: id, email: email, username: username, error: error };
                    return res.status(403).json(ret);
                }
                id = resultsEmail[0]._id;
                confirmation = resultsEmail[0].confirmation;
                email = resultsEmail[0].email;
                username = resultsEmail[0].username;
                let ret = { id: id, email: email, username: username, error: error };
                return res.status(200).json(ret);
            } else { //Password did not match
                error = "password is wrong";
                let ret = { id: id, email: email, username: username, error: error };
                return res.status(401).json(ret);
            }
        } else { //Login did not match any user
            error = "Login did not match any user";
            let ret = { id: id, email: email, username: username, error: error };
            return res.status(404).json(ret);
        }

    });

    // Register API
    app.post('/api/register', async (req, res, next) => {
        const { email, username, password } = req.body;
        let error = '';
        let db;

        try {
            db = client.db('app');

            // Check if email or username already exists
            const existingUsername = await db.collection('users').findOne({ username });
            const existingEmail = await db.collection('users').findOne({ email });

            if (existingUsername) {
                error = 'Username is already taken';
                return res.status(409).json({ id: -1, email: '', username: '', error });
            }

            if (existingEmail) {
                error = 'Email is already registered';
                return res.status(409).json({ id: -1, email: '', username: '', error });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const verificationCode = generate6DigitCode();
            const verificationToken = generateToken();

            // Insert new user
            const result = await db.collection('users').insertOne({
                email,
                username,
                password: hashedPassword, 
                isVerified: false,
                verifyCode: verificationCode,
                verifyToken: verificationToken
            });

            const verifyLink = appName + `/api/verify-link?token=${verificationToken}`;
            
            await transporter.sendMail({
                to: email,
                subject: 'Verify your email',
                html: `
                  <h3>Welcome to the app!</h3>
                  <p>Click <a href="${verifyLink}">here</a> to verify your email.</p>
                  <p>Or use this 6-digit code in the mobile app: <strong>${verificationCode}</strong></p>
                `
              }, (err, info) => {
                if (err) {
                  console.error('Email failed:', err);
                } else {
                  console.log('Email sent:', info.response);
                }
              });

            const resultId = result.insertedId;

            return res.status(201).json({
                id: resultId,
                email: email,
                username: username,
                error: ''
            });

        } catch (e) {
            console.error(e);
            error = e.toString();
            return res.status(500).json({ id: -1, email: '', username: '', error });
        }
    });

    // Verify User (6 digit)


    // Verify User (URL)


    // Resend Email Verification


    // Forgot Password (Send a link)


    // Forgot Password (Process)

    // Get User API
    app.get('/api/users/:userId', async (req, res, next) => {
        let userId = req.params.userId;
        let error = '';
        let db;

        try {
            db = client.db('app');

            // Convert userId string to ObjectId
            const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

            if (!user) {
                error = "User not found";
                return res.status(404).json({ id: -1, email: '', username: '', error });
            }

            // Return user info
            return res.status(200).json({
                id: user._id,
                email: user.email,
                username: user.username,
                error: ''
            });

        } catch (e) {
            console.error(e);
            error = "Invalid user ID or server error";
            return res.status(500).json({ id: -1, email: '', username: '', error });
        }
    });

}