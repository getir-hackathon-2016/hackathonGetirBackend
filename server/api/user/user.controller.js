'use strict';

var _ = require('lodash');
var User = require('./user.model');
var deepExtend = require('deep-extend');
// Get list of users
exports.index = function(req, res) {
  User.find(function (err, users) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(users);
  });
};

// Get a single user
exports.show = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.status(404).send('Not Found'); }
    return res.json(user);
  });
};

// Creates a new user in the DB.
exports.create = function(req, res) {
  User.create(req.body, function(err, user) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(user);
  });
};

// Updates an existing user in the DB.
exports.update = function(req, res) {
 User.findById(req.params.id, function (err, user) {
  if (err) return handleError(err);
  
  deepExtend(user, req.body);
  user.save(function (err) {
    if (err) return handleError(err);
    res.send(user);
  });
});
};

// Deletes a user from the DB.
exports.destroy = function(req, res) {
 User.remove({ _id: req.body.id }, function(err) {
    if (!err) {
            console.log("User deleted");
    }
    else {
             console.log("error deleting User");
    }
});
};

function handleError(res, err) {
  return res.status(500).send(err);
}