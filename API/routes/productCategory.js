const express = require('express');
const router = express.Router();
const errorManager = require('../services/errorManager');
const mongoose = require('mongoose');

const ProductCategory = require('../models/ProductCategory.model');




/**
 * GET
 * Find all category
 */
router.get('/product/categories', function (req, res, next) {
    ProductCategory
        .find({})
        .sort({'name': 1})
        .exec(function (err, categories) {
            if (err) {
                errorManager.handler(res, err, "find failed.")
            } else {
                res
                    .status(200)
                    .json({
                        "data": categories,
                        "message": "find all product categories success.",
                        "status": 200
                    })
            }
        })
});



module.exports = router;
