/**
 * Socket.io configuration
 */

'use strict';


var config = require('./environment');
var Courier = require('../api/courier/courier.model');
var _ = require('lodash');
var geolib = require('geolib');
var courierSocket = require('../api/courier/courier.socket');
var dataModule = require('../api/dataService');

var userLocation = {
    "latitude": "37.4224764",
    "longitude": "-54.0842499"
};

var testCategory = {
    name: "testCategory"
};


var availableCouriersUnsortedArray = [];


function courierRegisterToDatabase(socket) {
    availableCouriersUnsortedArray.push(socket);
}


// When the user disconnects.. perform this
function onDisconnect(socket) {
    console.log("disconeccteyiz")
    console.log(socket.id);
    
    
 availableCouriersUnsortedArray =  _.remove(availableCouriersUnsortedArray, function (courier) {
  return courier._id != socket.id
});

    console.log(availableCouriersUnsortedArray)
  
}

// When the user connects.. perform this
function onConnect(socket) {
 
    var availableCouriersSortedArray = [];


    // When the client emits 'getAvailableCouriers', this listens and executes
    socket.on('getAvailableCouriers', function(userData) {
        //  console.log("registerClient" + userData)
        // console.log(userData)

        /*
                // TO FILTER THE ARRAY OF COURIERS DEPENDING ON THEIR CATEGORY TYPES
                availableCouriersUnsortedArray = _.filter(availableCouriersUnsortedArray, function(courier) {
                    return courier.category == userData.category;
                });
        */
        //TO GET THE SORT MIN. DISTANCED SORTED ARRAY FROM THE USER'S LOCATION
        var orderedDistancesArray = geolib.orderByDistance({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
        }, availableCouriersUnsortedArray);

        //REORDER THE ORIGINAL COURIERS ARRAY AND PUSH IT TO THE NEW ARRAY(COURIERSSORTEDARRAY)
        _.forEach(orderedDistancesArray, function(value, index) {
            availableCouriersSortedArray.push(availableCouriersUnsortedArray[orderedDistancesArray[index].key])

        });

        //SEND THE SORTED COURIER ARRAY TO THE CLIENT
        socket.emit("sortedCouriersList", availableCouriersSortedArray);
        //console.log(availableCouriersSortedArray)
        console.info('[%s] %s', socket.address, JSON.stringify(userData, null, 2));

    });


    //A COURIER IS LOGGING IN
    socket.on('courierLogin', function(data) {
       
        dataModule.getCourier(data.courierId).then(function(courier) {
          
            socket.id = data.courierId;
            //courierin locationini güncelle
            availableCouriersUnsortedArray.push(courier);
            console.log(availableCouriersUnsortedArray)

        })
    });

    //A COURIER IS REGISTERING TO THE SYSTEM
    socket.on('registerCourier', function(data) {
        console.log(data)
        availableCouriersUnsortedArray.push(data);
        socket.broadcast.emit('new courierAvailable', data);
    });
    socket.on('UnRegisterCourier', function(data) {
        console.log(data)
        socket.broadcast.emit('courierRemoved', data);
        availableCouriersUnsortedArray.splice(availableCouriersUnsortedArray.indexOf(data), 1);
    });
    // Insert sockets below
    require('../api/address/address.socket').register(socket);
    require('../api/category/category.socket').register(socket);
    require('../api/order/order.socket').register(socket);
    require('../api/user/user.socket').register(socket);
    require('../api/courier/courier.socket').register(socket);
    require('../api/thing/thing.socket').register(socket);
}

module.exports = function(socketio) {
    // socket.io (v1.x.x) is powered by debug.
    // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
    //
    // ex: DEBUG: "http*,socket.io:socket"

    // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
    //
    // 1. You will need to send the token in `client/components/socket/socket.service.js`
    //
    // 2. Require authentication here:
    // socketio.use(require('socketio-jwt').authorize({
    //   secret: config.secrets.session,
    //   handshake: true
    // }));

    socketio.on('connection', function(socket) {
        socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

        socket.connectedAt = new Date();

        // Call onDisconnect.
        socket.on('disconnect', function() {
            onDisconnect(socket);
            console.info('[%s] DISCONNECTED', socket.address);

        });
        //console.log("sockets connected");
        //console.log(socketio.sockets.clients())
        // Call onConnect.
        onConnect(socket);

        console.info('[%s] CONNECTED', socket.id);
    });
};