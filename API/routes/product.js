//TODO => populate sur les deux get + tester

'use strict';

const express = require('express');
const router = express.Router();
const errorManager = require('../services/errorManager');
const mongoose = require('mongoose');

const ProductCategory = require('../models/ProductCategory');
const Product = require('../models/Product');
const Store = require('../models/Store');

/**
 * POST
 * Add new product
 */
router.post('/product', function (req, res, next) {
    let payload = req.body;

    let newProduct = new Product(payload);
    newProduct.created_at = Date.now();

    console.log(newProduct)

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
 * Edit product + edit category
 */
//TODO

/**
 * DELETE
 * Remove product from category
 */
//TODO


/**
 * POST
 * Add category to product
 */
router.post('/product/category', function (req, res, next) {
    let payload = req.body;
    let ids = [req.body._id, req.body.category_id];
    errorManager
        .isValidIds(ids)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, response.data, "error isValidIds")
            } else {
                Product
                    .findOne({'_id': payload._id})
                    .exec(function (err, product) {
                        if (err) {
                            errorManager
                                .handler(res, err, "error find one product")
                        } else {
                            if (product) {
                                ProductCategory
                                    .findOne({'_id': payload.category_id})
                                    .exec(function (err, productCategory) {
                                        if (err) {
                                            errorManager
                                                .handler(res, err, "findOne productCategory error")
                                        } else {
                                            if (productCategory) {
                                                let _idFields = [];
                                                for (let i = 0; i < productCategory.products.length; i++) {
                                                    _idFields.push(productCategory.products[i]._id)
                                                }
                                                errorManager
                                                    .checkDuplicated(payload._id, _idFields)
                                                    .then(function (response) {
                                                        if (response.error) {
                                                            errorManager
                                                                .handler(res, response.data, "error duplicated")
                                                        } else {
                                                            product.categories_product.push(productCategory);
                                                            product.save(function (err) {
                                                                if (err) {
                                                                    errorManager
                                                                        .handler(res, err, "product save failed")
                                                                } else {
                                                                    productCategory.products.push(product);
                                                                    productCategory
                                                                        .save(function (err) {
                                                                            if (err) {
                                                                                errorManager
                                                                                    .handler(res, err, "productCategory save failed")
                                                                            } else {
                                                                                res
                                                                                    .status(200)
                                                                                    .json({
                                                                                        "data": "product updated, product added in category product",
                                                                                        "message": "category product / product updated with success",
                                                                                        "status": 200
                                                                                    })
                                                                            }
                                                                        })
                                                                }
                                                            })
                                                        }
                                                    })
                                                    .catch(err => errorManager.handler(res, err, "error checkDuplicated"))
                                            } else {
                                                errorManager
                                                    .handler(res, "product category is empty", "produc category not found")
                                            }
                                        }
                                    })
                            } else {
                                errorManager
                                    .handler(res, "product is empty", "product not found")
                            }
                        }
                    })
            }
        })
        .catch(err => errorManager.handler(res, err, "error isValidsIds"));
});

/**
 * POST
 * Add store to product
 */
router.post('/product/store', function (req, res, next) {
    let payload = req.body;
    let ids = [req.body._id, req.body.store_id];
    errorManager
        .isValidIds(ids)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, response.data, "error isValidIds")
            } else {
                Store
                    .findOne({'_id': payload.store_id})
                    .populate('products')
                    .exec(function (err, store) {
                        if (err) {
                            errorManager
                                .handler(res, err, "error findOne store")
                        } else {
                            if (store) {
                                Product
                                    .findOne({'_id': payload._id})
                                    .exec(function (err, product) {
                                        if (err) {
                                            errorManager
                                                .handler(res, err, "error findOne product")
                                        } else {
                                            if (product) {
                                                let _idFields = [];
                                                for (let i = 0; i < store.products.length; i++) {
                                                    _idFields.push(store.products[i]._id)
                                                }
                                                errorManager
                                                    .checkDuplicated(payload._id, _idFields)
                                                    .then(function (response) {
                                                        console.log(response)
                                                        if (response.error) {
                                                            errorManager
                                                                .handler(res, response.data, "error manager duplicate")
                                                        } else {
                                                            store
                                                                .products
                                                                .push(product);
                                                            store.save(function (err) {
                                                                if (err) {
                                                                    errorManager
                                                                        .handler(res, err, "save product in store error")
                                                                } else {
                                                                    product
                                                                        .stores
                                                                        .push(store)
                                                                    product
                                                                        .save(function (err) {
                                                                            if (err) {
                                                                                errorManager
                                                                                    .handler(res, "save error", "save product in store error")
                                                                            } else {
                                                                                res
                                                                                    .status(200)
                                                                                    .json({
                                                                                        "data": "store updated, product added in store",
                                                                                        "message": "store / product updated with success",
                                                                                        "status": 200
                                                                                    })
                                                                            }
                                                                        })
                                                                }
                                                            })
                                                        }
                                                    })
                                                    .catch(err => errorManager.handler(res, err, "error checkDuplicated"))
                                            } else {
                                                errorManager
                                                    .handler(res, "product is empty", "product not found")
                                            }
                                        }
                                    })
                            } else {
                                errorManager
                                    .handler(res, err, "store is empty")
                            }
                        }
                    })
            }
        })
        .catch(err => console.log(err))
});

module.exports = router;

