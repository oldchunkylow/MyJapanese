const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    user: String,
    password: String
});

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;