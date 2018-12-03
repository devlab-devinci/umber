const express = require('express');
const router = express.Router();

const controller = require('../controllers/product.controller');

/* GET products listing. */
router.get('/', controller.index);

/* GET products id listing. */
router.get('/:id', controller.show);

/* POST product. */
router.post('/', controller.create);

/* PUT product. */
router.put('/:id', controller.update);

/* Delete product. */
router.delete('/:id', controller.destroy);

module.exports = router;
