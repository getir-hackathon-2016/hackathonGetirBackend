'use strict';

var _ = require('lodash');
var Address = require('./address.model');
var deepExtend = require('deep-extend');
// Get list of addresss
exports.index = function(req, res) {
    Address.find()
        .populate('user')
        .exec(function(err, addresses) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(201).json(addresses);

        })
};

// Get a single address
exports.show = function(req, res) {
    Address.findOne({
            _id: req.params.id
        })
        .populate('user')
        .exec(function(err, address) {
            if (err) {
                return handleError(res, err);
            }
            // console.log('The uploader is %s', content.uploader.name);
            return res.status(201).json(address);

        })
};

// Creates a new address in the DB.
exports.create = function(req, res) {
    Address.create(req.body, function(err, address) {
        if (err) {

            return handleError(res, err);
        } else {
            console.log(req.body)
            return res.status(201).json(address);
        }

    });
};

// Updates an existing address in the DB.
exports.update = function(req, res) {
    Address.findById(req.params.id, function(err, address) {
        if (err) return res.json(err);
        deepExtend(address, req.body);
        address.save(function(err, pl2) {
            if (err) return res.json(err);
            return res.json(pl2);
        });
    });
};

// Deletes a address from the DB.
exports.destroy = function(req, res) {
    Address.remove({
        _id: req.params.id
    }, function(err) {
        if (!err) {
            console.log("Address deleted")
            if (err) return res.json(err);
            return res.json("pl2");
        } else {

        }
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}