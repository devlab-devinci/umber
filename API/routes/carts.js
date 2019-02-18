'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/cart.controller');

const Authentication = require('../middleware/Authentication');

/* GET carts listing. */
router.get('/', Authentication.authChecker, controller.index);
// router.get('/dashboard', controller.dashboard);
router.get('/by-sha/:sha(*)', Authentication.authChecker, controller.bySha);
router.get('/:id', Authentication.authChecker, controller.show);

/* POST cart. */
// router.post('/remind/:id', controller.remind);
router.post('/', Authentication.authChecker, controller.create);

/* PUT cart. */
router.put('/:id', Authentication.authChecker, controller.update);


module.exports = router;
