require('express');
require('mongodb');
require("dotenv").config();
const md5 = require('./md5');
// const nodemailer = require('nodemailer');

module.exports.setApp = function (app, client) {
    // Login API
    app.post('/api/login', async (req, res, next) => {
        var id = -1;
        var email = '';
        var username = '';
        var error = '';
        var login = req.body.login;
        var password = md5(req.body.password);
        var db;

        try {
            db = client.db('LookUp');
            resultsUsername = await db.collection('Users').find({ username: login }).toArray();
            resultsEmail = await db.collection('Users').find({ email: login }).toArray();
        } catch (e) {
            error = e.toString;
            var ret = { id: id, email: email, username: username, error: error };
            res.status(500).json(ret);
        }


        if (resultsUsername.length > 0) { //Login matched a user's username
            if (resultsUsername[0].password === password) { //Password matched
                id = resultsUsername[0]._id;
                email = resultsUsername[0].email;
                username = resultsUsername[0].username;
                var ret = { id: id, email: email, username: username, error: error };
                res.status(200).json(ret);
            } else { //Password did not match
                error = "password is wrong";
                var ret = { id: id, email: email, username: username, error: error };
                res.status(401).json(ret);
            }
        } else if (resultsEmail.length > 0) { //Login matched a user's email
            if (resultsEmail[0].password === password) { //Password matched
                id = resultsEmail[0]._id;
                confirmation = resultsEmail[0].confirmation;
                email = resultsEmail[0].email;
                username = resultsEmail[0].username;
                var ret = { id: id, email: email, username: username, error: error };
                res.status(200).json(ret);
            } else { //Password did not match
                error = "password is wrong";
                var ret = { id: id, email: email, username: username, error: error };
                res.status(401).json(ret);
            }
        } else { //Login did not match any user
            error = "Login did not match any user";
            var ret = { id: id, email: email, username: username, error: error };
            res.status(404).json(ret);
        }

    });

    // Register API
    app.post('/api/register', async (req, res, next) => {

    });

    // Get User API
    app.get('/api/users/:userId', async (req, res, next) => {

    });

}