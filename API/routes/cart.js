const express = require('express');
const router = express.Router();

const controller = require('../controllers/cart.controller');

/* GET carts listing. */
router.get('/', controller.index);

/* GET carts id listing. */
router.get('/:id', controller.show);

/* POST cart. */
router.post('/', controller.create);

/* PUT cart. */
router.put('/:id', controller.update);

/* Delete cart. */
router.delete('/:id', controller.destroy);

module.exports = router;
