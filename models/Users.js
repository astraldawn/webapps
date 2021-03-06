/**
 * Created by mark on 24/05/16.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// TODO: Possibly add new fields to the schema?

var UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        lowercase: true,
        unique: true
    },
    accCreated: {
        type: Date,
        default: Date.now
    },
    hash: String,
    salt: String
});

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, 'SECRET');

    // SECRET should be an environment variable, should not be hard coded 
    // (#envvar), same as routes/index.js
};

// TODO: Find a possible not used username based on user info.

mongoose.model('User', UserSchema);
