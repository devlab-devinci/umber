'use strict';

const express = require('express');
const controller = require('../controllers/cart.controller');

const Authentication = require('../middleware/Authentication');
const router = express.Router();


/* GET carts listing. */
router.get('/', Authentication.authChecker, Authentication.allowRole('*'), controller.index);
// router.get('/dashboard', controller.dashboard);
router.get('/by-sha/:sha(*)', Authentication.authChecker, Authentication.allowRole('*'), controller.bySha);
router.get('/:id', Authentication.authChecker, Authentication.allowRole('*'), controller.show);

/* POST cart. */
// router.post('/remind/:id', controller.remind);
router.post('/', Authentication.authChecker, Authentication.allowRole('*'), controller.create);

/* PUT cart. */
router.put('/:id', Authentication.authChecker, Authentication.allowRole('*'), controller.update);


module.exports = router;
