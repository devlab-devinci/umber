'use strict';

var express = require('express');
var controller = require('../controllers/taxonomy.controller');

var router = express.Router();

/* GET products listing. */
router.get('/', controller.index);

/* GET product id listing. */
router.get('/:id', controller.show);

/* POST product*/
router.post('/', controller.create);

/* PUT product*/
router.put('/:id', controller.update);

/* DELETE product id. */
router.delete('/:id', controller.destroy);

module.exports = router;