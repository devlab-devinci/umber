'use strict';

var express = require('express');
var controller = require('../controllers/document.controller');

var router = express.Router();

/* GET products listing. */
router.get('/', controller.index);

/* GET product id listing. */
router.get('/:id', controller.show);

/* POST product*/
router.post('/', controller.create);

/* DELETE product id. */
router.delete('/:id', controller.destroy);

module.exports = router;