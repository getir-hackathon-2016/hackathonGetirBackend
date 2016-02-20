'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AddressSchema = new Schema({
    name: String,
    address: Number,
    town: String,
    country: String,
    latitude: String,
    longitude: String
});

module.exports = mongoose.model('Address', AddressSchema);