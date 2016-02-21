'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    i18nPlugin = require('mongoose-i18n');

var OrderSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    courier: {
        type: Schema.ObjectId,
        ref: 'Courier'
    },
    startTime :{ type : Date, default: Date.now },
    endTime : Date,
    info: String
});


OrderSchema.plugin(i18nPlugin, {
    languages: ['tr', 'en'],
    defaultLanguage: 'en'
});




module.exports = mongoose.model('Order', OrderSchema);