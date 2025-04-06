const express = require('express');
require("dotenv").config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const url = process.env.MONGODB_URI;
const MongoClient = require("mongodb").MongoClient;
var client;
try {
	client = new MongoClient(url);
	client.connect;
} catch (e) {
	console.error(e);
}

const detectAPI = require('./api/detect.js');
detectAPI.setApp(app, client); 
const usersAPI = require('./api/users.js');
usersAPI.setApp(app, client);

app.listen(PORT, () => {
  console.log(`Express API running at http://localhost:${PORT}`);
});