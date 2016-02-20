'use strict';

var _ = require('lodash');
var Courier = require('./courier.model');
var deepExtend = require('deep-extend');

// Get list of couriers
exports.index = function(req, res) {
    Courier.find(function(err, couriers) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(200).json(couriers);
    });
};

// Get a single courier
exports.show = function(req, res) {
     Courier.findOne({
            _id: req.params.id
        })
        .populate('category')
        .exec(function(err, courier) {
            if (err) {
                return handleError(res, err);
            }
            // console.log('The uploader is %s', content.uploader.name);
            return res.status(201).json(courier);

        })
};

exports.returnCourier = function(req, res) {
  Courier.findOne({
            password: req.params.password
        })
        .populate('category')
        .exec(function(err, courier) {
            if (err) {
                return handleError(res, err);
            }
            // console.log('The uploader is %s', content.uploader.name);
            return res.status(201).json(courier);

        })

};

// Creates a new courier in the DB.
exports.create = function(req, res) {
    Courier.create(req.body, function(err, courier) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(201).json(courier);
    });
};

// Updates an existing courier in the DB.
exports.update = function(req, res) {
    Courier.findById(req.params.id, function(err, courier) {
        if (err) return handleError(err);

        deepExtend(courier, req.body);
        user.save(function(err) {
            if (err) return handleError(err);
            res.send(user);
        });
    });
};

// Deletes a courier from the DB.
exports.destroy = function(req, res) {
    Courier.remove({
        _id: req.body.id
    }, function(err) {
        if (!err) {
            console.log("courier deleted");
        } else {
            console.log("error deleting courier");
        }
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}