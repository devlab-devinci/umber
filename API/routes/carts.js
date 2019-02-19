'use strict';

const express = require('express');
const controller = require('../controllers/cart.controller');

const Authentication = require('../middleware/Authentication');
const router = express.Router();


/* GET carts listing. */
router.get('/', controller.index);
// router.get('/dashboard', controller.dashboard);
router.get('/by-sha/:sha(*)', controller.bySha);
router.get('/:id', controller.show);

/* POST cart. */
// router.post('/remind/:id', controller.remind);
router.post('/', controller.create);

/* PUT cart. */
router.put('/:id', controller.update);


module.exports = router;
