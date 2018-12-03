const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

/* GET products listing. */
router.get('/', productController.index);

/* GET products id listing. */
router.get('/:id', productController.show);

/* POST product. */
router.post('/', productController.create);

/* PUT product. */
router.put('/:id', productController.update);

/* Delete product. */
router.delete('/:id', productController.destroy);

module.exports = router;
