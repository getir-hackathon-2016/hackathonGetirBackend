'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    address: [{
        type: Schema.ObjectId,
        ref: 'Address'
    }],
    userPassword : String,
    username : String,
    phone: Number,
    info: String
});

module.exports = mongoose.model('User', UserSchema);