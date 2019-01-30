'use strict';

const express = require('express');
const router = express.Router();
const errorManager = require('../services/errorManager');
const mongoose = require('mongoose');

const ProductCategory = require('../models/ProductCategory');
const Product = require('../models/Product');
const ProductCategoryPicture = require('../models/ProductCategoryPicture');


// upload
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const mime = require('mime');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/category_product/pictures')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
        });
    }
});
const upload_categoryProduct_picture = multer({storage: storage});

/**
 * POST
 * add new category
 */
router.post('/product/category', function (req, res, next) {
    let payload = req.body;

    if (payload.name) {
        let productCategory = new ProductCategory({
            name: payload.name,
        });
        productCategory
            .save(function (err) {
                if (err) {
                    errorManager.handler(res, err, "error save product category")
                } else {
                    res
                        .status(200)
                        .json({
                            "data": productCategory,
                            "message": "new product category added with success",
                            "status": 200
                        })
                }
            })
    } else {
        errorManager.handler(res, " name key missing body (expected string)", "key missing")
    }


});

/**
 * GET
 * show category by id
 */
router.get('/product/category/:id', function (req, res, next) {
    let id = req.params.id;
    errorManager
        .isValidId(id)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, response.data, "error checking")
            } else {
                ProductCategory
                    .findOne({'_id': response.data}, function (err, productCategory) {
                        if (err) {
                            errorManager.handler(res, err, "error find one category product")
                        } else {
                            if (productCategory) {
                                res
                                    .status(200)
                                    .json({
                                        "data": productCategory,
                                        "message": "show category product with success.",
                                        "status": 200
                                    })
                            } else {
                                errorManager.handler(res, "category product not found.", "category product dosnt exist")

                            }
                        }
                    })

            }
        })
        .catch(function (err) {
            errorManager
                .handler(res, err, "error _id checking")
        })

});


/**
 * POST
 * Add new picture for category product
 */
router.post('/product/category/picture', upload_categoryProduct_picture.single('picture'), function (req, res, next) {
    let payload = req.body;

    errorManager
        .isValidId(payload._id)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, response.data, "isValid error");
            } else {
                let objectId = mongoose.Types.ObjectId(payload._id); //cast string to objectId mongoose
                ProductCategory
                    .findOne({
                        _id: objectId
                    }, function (err, categoryProduct) {
                        if (err) {
                            errorManager.handler(res, err, "findone product category error")
                        } else {
                            if (categoryProduct) {
                                let newPictureProductCategory = new ProductCategoryPicture();
                                newPictureProductCategory.img.data = fs.readFileSync(req.file.path)
                                newPictureProductCategory.img.contentType = "image/png";
                                newPictureProductCategory.save(function (err) {
                                    if (err) {
                                        errorManager.handler(res, err, "error new picture product category")
                                    } else {
                                        categoryProduct.picture = newPictureProductCategory;
                                        categoryProduct
                                            .save(function (err) {
                                                if (err) {
                                                    errorManager.handler(res, err, "error new picture product category")
                                                } else {
                                                    res
                                                        .status(200)
                                                        .json({
                                                            "data": categoryProduct,
                                                            "message": "picture added with success in category product",
                                                            "status": 200
                                                        })
                                                }
                                            })
                                    }
                                })

                            } else {
                                errorManager.handler(res, "product not foud for this _id", "product not found.")
                            }
                        }
                    })
                    .catch(err => errorManager.handler(res, err, "error findOne ")
                    )


            }
        })
        .catch(err => errorManager.handler(res, err, "error isValid"));
});

/**
 * DELETE
 * Delete category for one product
 */
router.delete('/product/category', function (req, res, next) {
    let payload = req.body;
    errorManager
        .isValidId(payload._id)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, response.data, "isValid id error")
            } else {
                let objectId = mongoose.Types.ObjectId(payload._id); //cast string to objectId mongoose
                ProductCategory
                    .deleteOne({_id: objectId}, function (err) {
                        if (err) {
                            errorManager.handler(res, err, "error deleteOne category product for this id");
                        } else {
                            res
                                .json({
                                    "data": "product category deleted with success",
                                    "message": "deleted with success",
                                    "status": 200
                                })
                        }
                    });
            }
        })
        .catch(err => errorManager.handler(res, err, "error"))
});


/**
 * GET
 * List category
 */
router.get('/product/category', function (req, res, next) {
    ProductCategory
        .find({})
        .exec(function (err, categories) {
            if (err) {
                errorManager.handler(res, err, "find categories product error")
            } else {
                res
                    .json({
                        "data": categories,
                        "message": "find with success",
                        "status": 200
                    })
            }
        })
});


/**
 * UPDATE
 * Update category products
 */
router.put('/product/category', function (req, res, next) {
    let payload = req.body;

    errorManager
        .isValidId(payload._id)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, "error check isValid", response.data)
            } else {
                let objectId = mongoose.Types.ObjectId(payload._id); //cast string to objectId mongoose

                ProductCategory
                    .updateOne({_id: objectId}, {$set: {name: payload.name}}, function (err, categoryUpdated) {
                        if (err) {
                            errorManager
                                .handler(res, err, "Update failed.")
                        } else {
                            res
                                .status(200)
                                .json({
                                    "data": categoryUpdated,
                                    "message": "updated with success.",
                                    "status": 200
                                })
                        }
                    })
            }
        })
        .catch(err => errorManager.handler(res, err, "error manager isValid"))

});

module.exports = router;

