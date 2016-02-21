
var redis = require('redis');
var client = redis.createClient(); //creates a new client


var courierUnSortedArray = [];
client.on('connect', function() {
    console.log('Redis connected');
});


module.exports = {
    getCourierArray: function getCourier() {

        return courierUnSortedArray

    }
}

