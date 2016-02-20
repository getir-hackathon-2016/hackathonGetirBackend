var Courier = require('../api/courier/courier.model');
var courierSocket = require('../api/courier/courier.socket');
var _ = require('lodash');
var deepExtend = require('deep-extend');
var Category = require('../api/category/category.model');
var deepExtend = require('deep-extend');


module.exports = {
    getCourier: function getCourier(id) {

        return Courier.findOne({
                _id: id
            })
            .populate('category')
            .exec();

    },
    getCouriers: function getCourier() {

        return Courier.find(function(err, couriers) {

        }).populate('category').exec();

    }
}