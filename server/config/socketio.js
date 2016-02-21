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
var unirest = require('unirest');







//MOCK DATA

var availableCouriersUnsortedArray = [{
    _id: "56c819f72a75e63b1a44228e",
    name: "testCourier",
    password: 1,
    category: "56c7cd3562b0ab3310030e84",
    price: {
        usd: 23,
        tl: 50
    },
    info: "adawd",
    longitude: 33.2342,
    latitude: 45.23423,
    phone: 33
}, {
    _id: "56c7cd3562b0ab1210030e84",
    name: "courier2",
    phone: 43,
    password: 2,
    username: "ee",
    latitude: 54.406505,
    longitude: 18.67708,
    info: "info",
    category: "56c7cd3562b0ab3310030e84",
    price: {
        tl: 12,
        usd: 5
    }
}];

//REDIS
//redisService.client.set("availableCouriersUnsortedArray", JSON.stringify(availableCouriersUnsortedArray), redis.print);

// When the COURIER disconnects.. perform this
function onDisconnect(socket) {
    console.log("disconect")
    console.log(socket.id  + " Disconnected From Server");


    availableCouriersUnsortedArray = _.remove(availableCouriersUnsortedArray, function(courier) {
        if (courier) {
            return courier._id != socket.id
        }

    });

    console.log(availableCouriersUnsortedArray)

}

// MAKING THE INPUT PARAMETERS(LOCATIONS) READY TO USE BY MAPS API
var finalLink = "";
_.each(availableCouriersUnsortedArray, function(courier) {
    finalLink += courier.latitude + "," + courier.longitude + "|";
})
console.log(finalLink)

//&key=AIzaSyC99b5mcy21sz--bxYNPcb8aaPmqvmYNXo


// When the user connects.. perform this
function onConnect(socket) {


    // SENDS THE AVAILABLE COURIERS TO CLIENT DEPENDING ON THEIR LOCATION
    socket.on('getAvailableCouriers', function(userData) {


        //GET DISTANCE AND TIMES
        unirest.get('http://maps.googleapis.com/maps/api/distancematrix/json?origins=50.406505,22.67708&destinations=' + finalLink + '&mode=driving&language=en-EN&sensor=false')

        .header('Accept', 'application/json')
            .end(function(response) {
                //console.log(response.raw_body);
                console.log(JSON.parse(response.raw_body).rows[0].elements.length)
                for (var i = 0; i < JSON.parse(response.raw_body).rows[0].elements.length; i++) {

                    // ASSIGN EACH DISTANCE VALUE TO ITS CORRESPONDING OBJECT
                    availableCouriersUnsortedArray[i].distance = JSON.parse(response.raw_body).rows[0].elements[i];
                }
                console.log(availableCouriersUnsortedArray)
                    //SEND THE UNSORTED COURIER ARRAY TO THE CLIENT
                socket.emit('sortedCouriersList', availableCouriersUnsortedArray);
            });



        console.info('[%s] %s', socket.address, JSON.stringify(userData, null, 2));

    });



    //HANDLE ORDERS AND BROADCASTS TO ALL THE COURIERS, TO DETECT FOR WHICH ONE IS IT MEANT TO
    socket.on('newOrder', function(order) {

        console.log("New Order Received, Waiting For Courier To Respond")

        socket.broadcast.emit("offerFromUser", order);

    });


    //COURIER ACCEPTED THE JOB, HE IS NO MORE AVAILABLE
    socket.on('acceptedByCourier', function(data) {
        console.log("ORDER ACCEPTED BY COURIER")
        dataModule.postOrder(order) // Write it into Database in ORDER Model

        //REMOVE THAT COURIER TEMPORARILY WHO HAS JUST GOT THE JOB
        _.remove(availableCouriersUnsortedArray, function(courier) {
            return courier._id != order.courierId
        });
         console.log(availableCouriersUnsortedArray)

    })

    //THIS MESSAGE COMES FROM USER TO RELEASE THE COURIER, TO MAKE HIM AVAILABLE
    socket.on('JobAccomplished', function(courierid) {
        //GERI AL REMOVELADIGIN KURYEYI
        console.log("JOB ACCOMPLISHED")
        dataModule.getCourier(courierid).then(function(courier) {
            availableCouriersUnsortedArray.push(courier)
        })
        console.log(availableCouriersUnsortedArray)
    })



    //A COURIER IS LOGGING IN
    socket.on('courierLogin', function(data) {
        console.log("COURIER LOGGED IN");
        dataModule.getCourier(data.courierId).then(function(courier) {
            socket.id = data.courierId; //give socket the same name with data's courierId

            availableCouriersUnsortedArray.push(courier);
            console.log("-----AVAILABLE COURIERS-----");
            console.log(availableCouriersUnsortedArray)


        })
    });

    //REALTIME UPDATE THE CURRENT LOCATION OF COURIER
    socket.on('courierLocation', function(data) {
        console.log("courierLocation:::")
        var idx = -1;
        _.find(availableCouriersUnsortedArray, function(courier, courierIndex) {
            if (courier._id == data.courierId) {
                idx = courierIndex;
                return true;
            };
        });
        if (idx > -1) {
            availableCouriersUnsortedArray[idx].latitude = data.latitude
            availableCouriersUnsortedArray[idx].longitude = data.longitude
        }


        console.log(availableCouriersUnsortedArray)

    });
    

        //A COURIER IS REGISTERING TO THE SYSTEM
        socket.on('registerCourier', function(data) {
           
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

        console.info("Socket Connected");
    });
};