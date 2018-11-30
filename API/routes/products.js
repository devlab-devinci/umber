const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const productController = require('../controllers/product.controller');

router.get('/test', productController.test);

/* GET products listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a ll');
});

/* PUT product. */
router.put('/', function(req, res, next) {
  res.send('respond with a ll');
});

/* POST product. */
router.post('/', function(req, res, next) {
  res.send('respond with a ll');
});

module.exports = router;
