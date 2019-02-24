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
const Cart = require('../models/cart.model');

const uuidv1 = require('uuid/v1');


//API -> passer l'user id dans l'url
// recuperer tous les stores, les populate avec owner et recuperer que ce de l'user
// -> voir sur le pc fixe le truck avec after poplate (filter)
// -> return dans le json owner_store => coté app le set et faire une list view + ajouter dans les data le necessaire
//


/**
 * Return data for checkout stripe
 */
router.get('/payment/cart/:user_id/:user_name_fb', function (req, res, next) {
    let owner_id = req.params.user_id;
    let username_fb = req.params.user_name_fb;

    errorManager
        .isValidId(owner_id)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, "error is valid", "isValid")
            } else {
                let user_id = mongoose.Types.ObjectId(owner_id);
                User
                    .findOne({'_id': user_id})
                    .then(function (user) {
                        if (user) {
                            if (user.fullname === username_fb) {
                                Cart
                                    .find({
                                        'owner': user_id
                                    })
                                    .sort({
                                        'createdAt': -1
                                    })
                                    .populate('products')
                                    .then(function (carts) {
                                        if (carts) {
                                            let current_cart = carts[0];
                                            res.status(200).json({
                                                data: current_cart,
                                                status: 200
                                            })
                                        } else {
                                            errorManager
                                                .handler(res, "carts is empty", "carts not found")
                                        }
                                    })
                                    .catch(function (err) {
                                        console.log(err)
                                        errorManager
                                            .handler(res, err, "error find cart")
                                    })
                            } else {
                                errorManager
                                    .handler(res, "user dosnt correspond", "username !== owner")
                            }
                        } else {
                            errorManager
                                .handler(res, "user empty", "no user found")
                        }
                    })
                    .catch(function (err) {
                        errorManager
                            .handler(res, err, "error findOne user")
                    })
            }
        })
        .catch(function (err) {
            console.log("error is valid", err)
            errorManager
                .handler(res, err, "error is valid.")
        })
});

router.get('/dual/categories/:owner_id', Authentication.authChecker, function (req, res, next) {
    let owner_id = req.params.owner_id;

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
                                    Store
                                        .find({})
                                        .populate('owner')
                                        .exec(function (err, stores) {
                                            if (err) {
                                                errorManager
                                                    .handler(res, err, "find stores error")
                                            } else {
                                                if (stores) {
                                                    const owner_stores = stores.filter(field => owner_id == field.owner._id)
                                                    res
                                                        .status(200)
                                                        .json({
                                                            "owner_stores": owner_stores,
                                                            "categories_store": categoriesStore,
                                                            "categories_product": categoriesProduct,
                                                            "message": "dual categories (stores / products) success.",
                                                            "status": 200
                                                        })
                                                } else {
                                                    errorManager
                                                        .handler(res, "stores empty.", "stores not found")
                                                }
                                            }
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
    let owner_store_id = payload.owner_store_id;

    delete payload.owner_id; // clear object for new Product
    delete payload.category_name;
    delete payload.owner_store_id;


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

                                        Store
                                            .findOne({'_id': owner_store_id})
                                            .then(function (store) {
                                                if (store) {
                                                    store.products.push(newProduct._id);
                                                    store.save(function (err) {
                                                        if (err) {
                                                            console.log("ERRRRRORé", err);
                                                            errorManager
                                                                .handler(res, err, "error store save newproduct._id")
                                                        } else {
                                                            newProduct.store = store._id;
                                                            newProduct.store_access_name = store.name;
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
                                                        }
                                                    })

                                                } else {
                                                    errorManager
                                                        .handler(res, "store empty", "store not found")
                                                }
                                            })
                                            .catch(function (err) {
                                                errorManager
                                                    .handler(res, err, "find one store")
                                            });
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
                    .populate('categories')
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


//add cart to DB
router.post('/cart', function (req, res, next) {
    let payload = req.body;
    //to check validId -> then cast to mongoose id
    console.log("user_id", payload.user_id);

    console.log("date", new Date());

    console.log("reference", uuidv1());

    console.log("products : ", payload.products);
    errorManager
        .isValidId(payload.user_id)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, response.data, "isValidId error")
            } else {
                let user_id = mongoose.Types.ObjectId(payload.user_id);
                User
                    .findOne({'_id': user_id})
                    .then(function (user) {
                        if (user) {
                            Cart
                                .find({
                                    'status': 'active'
                                })
                                .populate('owner')
                                .then(function (carts) {
                                    if (carts) {

                                        /* CHECKING already one cart exist
                                        let active_cart_for_owner = [];

                                        for (var i in carts) {
                                            if (carts[i].owner._id.toString() === user_id.toString()) {
                                                console.log("equal");
                                                active_cart_for_owner.push(carts[i].owner)
                                            }
                                        }
                                        */
                                        // if (active_cart_for_owner.length === 0) { // CHECKING already one cart exist
                                        let newCart = new Cart();
                                        newCart.owner = user._id;
                                        newCart.reference = uuidv1();
                                        newCart.createdAt = new Date();
                                        newCart.updateAt = newCart.createdAt;
                                        newCart.isPaid = false;
                                        newCart.status = 'active';
                                        newCart.total_bill = payload.total_bill;
                                        newCart.products = payload.products;
                                        newCart
                                            .save(function (err) {
                                                console.log("éerror ???", err);
                                                if (err) {
                                                    console.log("errrrror", err);
                                                    errorManager
                                                        .handler(res, err, "error save cart")
                                                } else {
                                                    console.log("no error ??");
                                                    res
                                                        .status(200)
                                                        .json({
                                                            "data": newCart,
                                                            "status": 200
                                                        })
                                                }
                                            })
                                        /*
                                        //CHECKING already one cart exit
                                        } else {
                                            res.status(200)
                                                .json({
                                                    "data": "Deja un panier existant",
                                                    "status": 200
                                                });
                                        }
                                        */
                                    } else {
                                        errorManager
                                            .handler(res, "carts not found", "carts empty")
                                    }
                                })

                        } else {
                            errorManager
                                .handler(res, "user not found", "user empty")
                        }
                    })
                    .catch(function (err) {
                            console.log("err", err);
                            errorManager
                                .handler(res, err, "error find user")
                        }
                    )
            }
        })
        .catch(function (err) {
            console.log("err", err);
            errorManager
                .handler(res, err, "isValidId error")
        })

});

module.exports = router;