'use strict';

var express = require('express');
var controller = require('./courier.controller');
var controllerSocket = require('./courier.socket');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/password/:password', controller.returnCourier);
router.post('/', controller.create);
//router.post('/', controllerSocket.register);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;