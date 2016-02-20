'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    i18nPlugin = require('mongoose-i18n');

var CourierSchema = new Schema({
    name: String,
    phone: {
        type : Number,
        default : 33
    },
    latitude: {
        type : Number,
        default : 33
    },
    password : {
        type : Number,
        required : true
    },
    longitude: {
        type : Number,
        default : 33
    },
    info: {
        type : String,
        default : ""
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    price : {
        tl : {
        type : Number,
        default : 0
        },
        usd : {
        type : Number,
        default : 0
        }
    }
});

CourierSchema.plugin(i18nPlugin, {
    languages: ['tr', 'en'],
    defaultLanguage: 'en'
});

module.exports = mongoose.model('Courier', CourierSchema);