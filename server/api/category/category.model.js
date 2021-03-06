'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
     i18nPlugin = require('mongoose-i18n');

var CategorySchema = new Schema({
  name: {
  	type: String,
  	i18n: true
  },
  info: String
});

CategorySchema.plugin(i18nPlugin, {
    languages: ['tr', 'en'],
    defaultLanguage: 'en'
});
module.exports = mongoose.model('Category', CategorySchema);