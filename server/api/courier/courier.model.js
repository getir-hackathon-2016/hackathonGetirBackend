'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    i18nPlugin = require('mongoose-i18n');

var CourierSchema = new Schema({
    name: String,
    phone : String,
    latitude : Number,
    longitude : Number,
    info: String,
    active: Boolean,
    category :  {
        type: Schema.ObjectId,
        ref: 'Category'
    }
});

CourierSchema.plugin(i18nPlugin, {
    languages: ['tr', 'en'],
    defaultLanguage: 'en'
});

module.exports = mongoose.model('Courier', CourierSchema);