'use strict';

var _ = require('lodash');
var Category = require('./category.model');
var deepExtend = require('deep-extend');
// Get list of categorys
exports.index = function(req, res) {
    Category.find()
        .populate('user')
        .exec(function(err, categorys) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(201).json(categorys);

        })
};

// Get a single category
exports.show = function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if (err) {
            return handleError(res, err);
        }
        if (!category) {
            return res.status(404).send('Not Found');
        }
        return res.json(category);
    });
};

// Creates a new category in the DB.
exports.create = function(req, res) {
    Category.create(req.body, function(err, category) {
        if (err) {

            return handleError(res, err);
        } else {
            console.log(req.body)
            return res.status(201).json(category);
        }

    });
};

// Updates an existing category in the DB.
exports.update = function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if (err) return res.json(err);
        deepExtend(category, req.body);
        category.save(function(err, pl2) {
            if (err) return res.json(err);
            return res.json(pl2);
        });
    });
};

// Deletes a category from the DB.
exports.destroy = function(req, res) {
    Category.remove({
        _id: req.params.id
    }, function(err) {
        if (!err) {
            console.log("Category deleted")
            if (err) return res.json(err);
            return res.json("pl2");
        } else {

        }
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}