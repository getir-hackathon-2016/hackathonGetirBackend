'use strict';

var _ = require('lodash');
var Courier = require('./courier.model');
var deepExtend = require('deep-extend');
var dataModule = require('../dataService');
var unirest = require('unirest');
// Get list of couriers
exports.index = function(req, res) {
    try {
        // the synchronous code that we want to catch thrown errors on
        dataModule.getCouriers().then(function(couriers) {
            console.log(couriers)

            return res.status(200).json(couriers);
        })
    } catch (err) {
        // handle the error safely
        console.log(err)
    }
};

// Get a single courier
exports.show = function(req, res) {
    console.log(req.params.id)
    try {
        // the synchronous code that we want to catch thrown errors on

        
//AIzaSyC99b5mcy21sz--bxYNPcb8aaPmqvmYNXo
        dataModule.getCourier(req.params.id).then(function(courier) {
            console.log(courier)
            unirest.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=54.406505,18.67708&destinations=54.446251,18.570993|52.446251,28.570993|54.446251,28.570993&mode=driving&language=en-EN&sensor=false&key=AIzaSyC99b5mcy21sz--bxYNPcb8aaPmqvmYNXo')
                .header('Accept', 'application/json')
                .end(function(response) {
                    
                    console.log(response.raw_body)
                });

            return res.status(200).json(courier);
        })
    } catch (err) {
        // handle the error safely
        console.log(err)
    }
};


//LOGIN
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
            courier.sendNotif("asdasda");
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