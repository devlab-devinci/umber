//TODO => populate sur les deux get + tester

'use strict';

const express = require('express');
const router = express.Router();
const errorManager = require('../services/errorManager');
const mongoose = require('mongoose');

const ProductCategory = require('../models/ProductCategory');
const Product = require('../models/Product');


/**
 * POST
 * Add new product
 */
router.post('/product', function (req, res, next) {
    let payload = req.body;

    let newProduct = new Product(payload);
    newProduct.created_at = Date.now();
    newProduct
        .save(function (err) {
            if (err) {
                errorManager.handler(res, err, "error save mongo")
            } else {
                res
                    .status(200)
                    .json({
                        "data": newProduct,
                        "message": "product added with success",
                        "status": 200
                    })
            }
        })


});


/**
 * GET
 * List product
 */
router.get('/product', function (req, res, next) {
    Product
        .find({})
        //TODO populate pour pictures / category / stores
        .then(function (err, products) {
            if (err) {
                errorManager
                    .handler(res, err, "error find products")
            } else {
                res
                    .status(200)
                    .json({
                        "data": products,
                        "message": "product added with success",
                        "status": 200
                    })
            }
        })
        .catch(err => errorManager.handler(res, err, "error find product"))
});


/**
 * GET
 * Find one by id
 */
router.get('/product/:id', function (req, res, next) {
    let params_id = req.params.id;
    errorManager
        .isValidId(params_id)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, "error validation", response.data)
            } else {
                let objectId = mongoose.Types.ObjectId(params_id); //cast string to objectId mongoose
                Product
                    .findOne({'_id': objectId})
                    //TODO populate later
                    .exec(function (err, product) {
                        if (err) {
                            errorManager.handler(res, err, "findOne failed.")
                        } else {
                            res
                                .status(200)
                                .json({
                                    "data": product,
                                    "message": "show by id success.",
                                    "status": 200
                                })
                        }
                    })
            }
        })
        .catch(err => errorManager.handler(res, err, "error id validation"));
});

/**
 * DELETE
 * Delete product
 */
router.delete('/product', function (req, res, next) {
    let payload = req.body;

    errorManager
        .isValidId(payload._id)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, "error id invalide", "invalid id given")
            } else {
                let objectId = mongoose.Types.ObjectId(payload._id); //cast string to objectId mongoose
                Product
                    .deleteOne({_id: objectId}, function (err) {
                        if (err) {
                            errorManager
                                .handler(res, err, "error delete one")
                        } else {
                            res
                                .status(200)
                                .json({"data": "deleted product", "message": "deleted with success.", "status": 200})
                        }
                    })
            }
        })
        .catch(err => errorManager.handler(res, err, "error errorManager"))
});

/**
 * POST
 * Add pictures for product
 */
//TODO


/**
 * PUT
 * Edit product
 */
//TODO


/**
 * POST
 * Add category to product
 */
//TODO

/**
 * POST
 * Add store to product
 */
router.post('/product/store', function (req, res, next) {
    let payload = req.body;

    //TODO check 2 _id store  + _id product
    // TODO get product + store
    //  TODO push store in product.stores
    //TODO = fin

    res.json("todo")
});

module.exports = router;

