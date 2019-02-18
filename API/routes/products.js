'use strict';

const express = require('express');
const router = express.Router();

const Authentication = require('../middleware/Authentication');

const controller = require('../controllers/product.controller');

/* GET products listing. */
router.get('/', Authentication.authChecker, Authentication.allowRole('*'), controller.index);

/* GET products id listing. */
router.get('/:id', Authentication.authChecker, Authentication.allowRole('*'), controller.show);

/* POST product. */
router.post('/', Authentication.authChecker, controller.create);

/* PUT product. */
router.put('/:id', Authentication.authChecker, Authentication.allowRole('*'), controller.update);

/* Delete product. */
router.delete('/:id', Authentication.authChecker, controller.destroy);

module.exports = router;
