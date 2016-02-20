'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AddressSchema = new Schema({
    name: String,
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    address: Number,
    town: String,
    country: String,
    latitude: String,
    longtitude: String
});

module.exports = mongoose.model('Address', AddressSchema);