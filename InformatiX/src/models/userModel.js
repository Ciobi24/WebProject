const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: String,
    lastname: String,
    firstname: String,
    birthday: Date,
    city: String,
    school: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
