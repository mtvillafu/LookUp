require('express');
require('mongodb');
require("dotenv").config();
const md5 = require('./md5');
// const nodemailer = require('nodemailer');

module.exports.setApp = function (app, client) {
    // Login API
    app.post('/api/login', async (req, res, next) => {
        let id = -1;
        let email = '';
        let username = '';
        let error = '';
        const login = req.body.login;
        const password = md5(req.body.password);
        let db;

        try {
            db = client.db('app');
            resultsUsername = await db.collection('users').find({ username: login }).toArray();
            resultsEmail = await db.collection('users').find({ email: login }).toArray();
        } catch (e) {
            error = e.toString;
            let ret = { id: id, email: email, username: username, error: error };
            res.status(500).json(ret);
        }


        if (resultsUsername.length > 0) { //Login matched a user's username
            if (resultsUsername[0].password === password) { //Password matched
                id = resultsUsername[0]._id;
                email = resultsUsername[0].email;
                username = resultsUsername[0].username;
                let ret = { id: id, email: email, username: username, error: error };
                res.status(200).json(ret);
            } else { //Password did not match
                error = "password is wrong";
                let ret = { id: id, email: email, username: username, error: error };
                res.status(401).json(ret);
            }
        } else if (resultsEmail.length > 0) { //Login matched a user's email
            if (resultsEmail[0].password === password) { //Password matched
                id = resultsEmail[0]._id;
                confirmation = resultsEmail[0].confirmation;
                email = resultsEmail[0].email;
                username = resultsEmail[0].username;
                let ret = { id: id, email: email, username: username, error: error };
                res.status(200).json(ret);
            } else { //Password did not match
                error = "password is wrong";
                let ret = { id: id, email: email, username: username, error: error };
                res.status(401).json(ret);
            }
        } else { //Login did not match any user
            error = "Login did not match any user";
            let ret = { id: id, email: email, username: username, error: error };
            res.status(404).json(ret);
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

            // Insert new user
            const result = await db.collection('users').insertOne({
                email,
                username,
                password: md5(password), 
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

    // Get User API
    app.get('/api/users/:userId', async (req, res, next) => {

    });

}