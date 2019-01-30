'use strict';

const express = require('express');
const router = express.Router();
const errorManager = require('../services/errorManager');
const mongoose = require('mongoose');

const ProductCategory = require('../models/ProductCategory');
const Product = require('../models/Product');

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
 * Add new picture for category
 */
router.post('/product/category/picture', upload_categoryProduct_picture.single('picture'), function (req, res, next) {
    res.json("ok");
});

// TODO
// ADD  picture / pictures (multi upload) / DELETE PICTURE

// ADD product / delete product

// DELETE category

// update category

module.exports = router;

