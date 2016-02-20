/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Courier = require('./courier.model');

exports.register = function(socket) {
  Courier.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Courier.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('courier:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('courier:remove', doc);
}