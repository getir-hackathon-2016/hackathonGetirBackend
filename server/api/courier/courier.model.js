'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    i18nPlugin = require('mongoose-i18n');

var CourierSchema = new Schema({
    name: String,
    phone: Number,
    latitude: Number,
    password : Number,
    longitude: Number,
    info: String,
    active: Boolean,
    category: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    price : {
        tl : Number,
        usd : Number
    }
});

CourierSchema.plugin(i18nPlugin, {
    languages: ['tr', 'en'],
    defaultLanguage: 'en'
});

module.exports = mongoose.model('Courier', CourierSchema);