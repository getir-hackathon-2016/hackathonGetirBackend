/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Courier = require('./courier.model');

exports.register = function(socket) {
  Courier.schema.post('save', function (doc) {
    testFunc(socket, doc);
  });
  Courier.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}
var testFunc = function(socket,doc) {
	return doc;
};
exports.onSave = testFunc;



function onRemove(socket, doc, cb) {
  socket.emit('courier:remove', doc);
}