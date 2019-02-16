//contains every duo calls like (category product + category company)
'use strict';

const express = require('express');
const router = express.Router();
const errorManager = require('../services/errorManager');
const mongoose = require('mongoose');

const Store = require('../models/Store');
const User = require('../models/Users');
const Product = require('../models/product.model');
const StoreCategory = require('../models/CategoryStore');
const ProductCategory = require('../models/ProductCategory.model');
const Authentication = require('../middleware/Authentication');

router.get('/dual/categories', Authentication.authChecker, function (req, res, next) {
    ProductCategory
        .find({})
        .sort({'name': 1})
        .exec(function (err, categoriesProduct) {
            if (err) {
                errorManager.handler(res, err, "find failed.")
            } else {
                if (categoriesProduct) {
                    StoreCategory
                        .find({})
                        .sort({'name': 1})
                        .exec(function (err, categoriesStore) {
                            if (err) {
                                errorManager.handler(res, err, "find failed.")
                            } else {
                                if (categoriesStore) {
                                    res
                                        .status(200)
                                        .json({
                                            "categories_store": categoriesStore,
                                            "categories_product": categoriesProduct,
                                            "message": "dual categories (stores / products) success.",
                                            "status": 200
                                        })
                                } else {
                                    errorManager.handler(res, "no stores catogires find.", "categoriesStore empty")
                                }
                            }
                        })
                } else {
                    errorManager.handler(res, "no categories found", "no categories")
                }

            }
        })
});


router.post('/offer', Authentication.authChecker, function (req, res, next) {
    let payload = req.body;
    let owner_id = req.body.owner_id;
    let product_category_name = req.body.category_name;

    delete payload.owner_id; // clear object for new Product
    delete payload.category_name;


    ProductCategory
        .findOne({"name": product_category_name})
        .then(function (productCategory) {
            if (productCategory) {
                errorManager
                    .isValidId(owner_id)
                    .then(function (response) {
                        if (response.error) {
                            errorManager
                                .handler(res, "isValidId Error", response)
                        } else {
                            User
                                .findOne({_id: owner_id})
                                .then(function (user) {
                                    if (user) {
                                        let newProduct = new Product(payload)
                                        newProduct.owner = owner_id
                                        newProduct.categories.push(productCategory._id)
                                        newProduct
                                            .save(function (err) {
                                                if (err) {
                                                    console.log(err)
                                                    errorManager
                                                        .handler(res, err, "error save newProduct")
                                                } else {
                                                    res
                                                        .status(200)
                                                        .json({
                                                            "data": newProduct,
                                                            "status": 200
                                                        })
                                                }
                                            })
                                    } else {
                                        console.log("user is empty");
                                        errorManager
                                            .handler(res, "user is empty", "user not found")
                                    }
                                })
                                .catch(function (err) {
                                    console.log(err)
                                    errorManager
                                        .handler(res, err, "findone user error")
                                })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                        errorManager
                            .handler(res, err, "error isValidId")
                    })

            } else {
                errorManager
                    .handler(res, "product category not found", "product category empty")
            }
        })
        .catch(function (err) {
            console.log(err)
            errorManager.handler(res, err, "err find one productCategory")
        })
});


//Return product from user _id given
router.get('/offers/:user_id', function (req, res, next) {
    let user_id = req.params.user_id;

    errorManager
        .isValidId(user_id)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, "error is valid id", "error is valid id")
            } else {
                Product
                    .find({owner: user_id})
                    .then(function (product) {
                        res
                            .status(200)
                            .json({
                                "data": product,
                                "status": 200
                            })
                    })
                    .catch(function (err) {
                        errorManager
                            .handler(res, err, "error find one ")
                    })
            }

        })
        .catch(function (err) {
            errorManager
                .handler(res, err, "is valid id error")
        })

});

module.exports = router;