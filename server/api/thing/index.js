'use strict';

var express = require('express');
var controller = require('./thing.controller');
//var socketController = require('./thing.socket');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
//router.post('/', socketController.register);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;