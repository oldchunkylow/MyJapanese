const express = require('express');
const sessions = express.Router();
const User = require('../models/users.js');

sessions.get('/home', (req, res) => {
    res.send('Welcome!');
})

sessions.get('/secret', (req, res) => {
    res.send('The password is potato');
})

module.exports = sessions;