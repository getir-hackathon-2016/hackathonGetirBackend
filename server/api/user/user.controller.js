'use strict';

var _ = require('lodash');
var User = require('./user.model');
var deepExtend = require('deep-extend');
// Get list of users
exports.index = function(req, res) {
    User.find()
        .populate('address')
        .exec(function(err, categorys) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(201).json(categorys);
        })
};

//LOGIN get a single user
exports.show = function(req, res) {
    User.findOne({
            "username": req.params.username,
            "password": req.params.userPassword
        })
        .populate('address')
        .exec(function(err, user) {
            if (err) {
                console.log("either password or username is wrong");
                return handleError(res, err);
            }
           console.log("USER LOGGED IN: "+user.username)
            return res.status(201).json(user);
        })
};
// Creates a new user in the DB.
exports.create = function(req, res) {
    User.create(req.body, function(err, category) {
        if (err) {

            return handleError(res, err);
        } else {
            console.log(req.body)
            return res.status(201).json(category);
        }

    });
};

// Updates an existing user in the DB.
exports.update = function(req, res) {
    User.findById(req.params.id, function(err, category) {
        if (err) return res.json(err);
        deepExtend(category, req.body);
        category.save(function(err, pl2) {
            if (err) return res.json(err);
            return res.json(pl2);
        });
    });
};

// Deletes a user from the DB.
exports.destroy = function(req, res) {
    User.remove({
        _id: req.body.id
    }, function(err) {
        if (!err) {
            console.log("User deleted");
        } else {
            console.log("error deleting User");
        }
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}