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
const Command = require('../models/command.model');
const CmdHistorique = require('../models/cmdhistorique.model');
const StoreLike = require('../models/storeLike.model');

const uuidv1 = require('uuid/v1');
let Moment = require('moment');

const _ = require('lodash');

const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload/products_picture/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({storage: storage});

const base64Img = require('base64-img');
const path = require('path');

//API -> passer l'user id dans l'url
// recuperer tous les stores, les populate avec owner et recuperer que ce de l'user
// -> voir sur le pc fixe le truck avec after poplate (filter)
// -> return dans le json owner_store => coté app le set et faire une list view + ajouter dans les data le necessaire
//


/**
 * Return data for checkout stripe
 */
router.get('/payment/cart/:user_id/:user_name_fb', Authentication.authChecker, function (req, res, next) {
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
                                    .populate('products store owner')
                                    .then(function (carts) {
                                        if (carts) {
                                            let current_cart = carts[0];
                                            res.status(200).json({
                                                data: current_cart,
                                                current_user: user,
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
router.get('/offers/:user_id', Authentication.authChecker, function (req, res, next) {
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
    router.post('/cart', Authentication.authChecker, function (req, res, next) {
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


router.post('/commands', Authentication.authChecker, function (req, res, nest) {
    let payload = req.body;
    let store_id = req.body.store_id;

    Store
        .findOne({_id: mongoose.Types.ObjectId(store_id)})
        .populate('owner')
        .exec(function (err, store) {
            if (err) {
                console.log(err);
                errorManager
                    .handler(res, err, "error")
            } else {
                payload.vendor = store.owner._id;
                let newCommand = new Command(payload);
                newCommand
                    .save(function (err) {
                        if (err) {
                            errorManager
                                .handler(res, err, "error save new command");
                        } else {
                            res
                                .status(200)
                                .json({
                                    "data": newCommand,
                                    "status": 200
                                })
                        }
                    });
            }

        })
});

// ajust quantity of products when command is confirmed and paid
router.post('/products/ajusted', Authentication.authChecker, function (req, res, next) {
    let data = req.body;

    let error = false;

    errorManager
        .isValidIds(data.products)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, response.data, "error isValidIds, invalid id found in array")
            } else {
                //todo -> remove and check if quantity is under 0 -> return 400 avec erreur

                let objIds = compressObj(data.products); // return {_id of product: quantity}
                for (let index in objIds) {
                    let quantityTaken = objIds[index];
                    Product
                        .findOne({_id: mongoose.Types.ObjectId(index)}, function (err, product) {
                            if (err) {
                                error = true;
                            } else {
                                let current_stock = product.stock;
                                console.log("CURRENT STOCK : ", current_stock);
                                console.log("QUANTITY TAKEN : ", quantityTaken);
                                if ((current_stock - quantityTaken) < 0) {
                                    console.log("CURRENT STOCK - QUANTITY TAKEN ERROR");
                                    error = true;
                                } else {
                                    product.stock = current_stock - quantityTaken;

                                    product.save(function (err) {
                                        if (err) {
                                            error = true;
                                        }
                                    })
                                }
                            }
                        })
                }

                console.log("ERROR HIT ?", error);
                if (!error) {
                    res.status(200).json({
                        "data": "ajusted with success",
                        "status": 200
                    });
                } else {
                    errorManager
                        .handler(res, "error during ajusting quantity", "quantity updated has failed.")
                }
            }
        })
        .catch(err => {
            errorManager
                .handler(res, err, "error isvalidIds")
        });
});


/**
 * GET return list "commands en cours" for buyer only
 */
router.get('/commands/:user_id/prepare', Authentication.authChecker, function (req, res, next) {
    let user_id = req.params.user_id;
    errorManager
        .isValidId(user_id)
        .then(function (response) {
            if (response.error) {
                errorManager.handler(res, response.data, "error is validId")
            } else {
                let userId = mongoose.Types.ObjectId(user_id); // formmated iD
                User
                    .findOne({_id: userId}, function (err, user) {
                        if (err) {
                            errorManager.handler(res, err, "error user findOne")
                        } else {
                            if (user) {
                                Command
                                    .find({buyer_quick_access: userId, status: "prepare", ready_at: null})
                                    .populate('user products')
                                    .then(function (commands) {
                                        if (commands) {
                                            res.status(200).json({
                                                "data": commands,
                                                "status": 200
                                            })
                                        } else {
                                            errorManager.handler(res, "commands empty", "no commands.")
                                        }
                                    })
                                    .catch(function (err) {
                                        errorManager.handler(res, err, "find commands error")
                                    })
                            } else {
                                error.handler(res, "user not found.", "no user for this _id given")
                            }
                        }
                    })
            }
        })
        .catch(function (err) {
            errorManager.handler(res, err, "isValidId error")
        });
});

/**
 * GET commands historique for custommer
 */
router.get('/commands/:user_id/historic', Authentication.authChecker, function (req, res, next) {
    let user_id = req.params.user_id;
    errorManager
        .isValidId(user_id)
        .then(function (response) {
            if (response.error) {
                errorManager.handler(res, response.data, "error is validId")
            } else {
                let userId = mongoose.Types.ObjectId(user_id); // formmated iD
                User
                    .findOne({_id: userId}, function (err, user) {
                        if (err) {
                            errorManager.handler(res, err, "error user findOne")
                        } else {
                            if (user) {
                                CmdHistorique
                                    .find({buyer_quick_access: userId, status: "ready"})
                                    .populate('user products')
                                    .then(function (commandsHistoriques) {
                                        if (commandsHistoriques) {
                                            res.status(200).json({
                                                "data": commandsHistoriques,
                                                "status": 200
                                            })
                                        } else {
                                            errorManager.handler(res, "commands historique empty", "no commands historique.")
                                        }
                                    })
                                    .catch(function (err) {
                                        errorManager.handler(res, err, "find commands historique error")
                                    })
                            } else {
                                error.handler(res, "user not found.", "no user for this _id given")
                            }
                        }
                    })
            }
        })
        .catch(function (err) {
            errorManager.handler(res, err, "isValidId error")
        });
});

/**
 * GET retourne la liste des panier d'un vendor en cours
 */
router.get('/commands/:user_id/vendor/prepare', Authentication.authChecker, function (req, res, next) {
    let user_id = req.params.user_id;
    errorManager
        .isValidId(user_id)
        .then(function (response) {
            if (response.error) {
                errorManager.handler(res, response.data, "error is validId")
            } else {
                let userId = mongoose.Types.ObjectId(user_id); // formmated iD
                User
                    .findOne({_id: userId}, function (err, user) {
                        if (err) {
                            errorManager.handler(res, err, "error user findOne")
                        } else {
                            if (user) {
                                Command
                                    .find({vendor: userId, status: "prepare", ready_at: null})
                                    .populate('user products')
                                    .then(function (commands) {
                                        if (commands) {
                                            res.status(200).json({
                                                "data": commands,
                                                "status": 200
                                            })
                                        } else {
                                            errorManager.handler(res, "commands empty", "no commands.")
                                        }
                                    })
                                    .catch(function (err) {
                                        errorManager.handler(res, err, "find commands error")
                                    })
                            } else {
                                error.handler(res, "user not found.", "no user for this _id given")
                            }
                        }
                    })
            }
        })
        .catch(function (err) {
            errorManager.handler(res, err, "isValidId error")
        });
});


/**
 * GET commands historique for vendor
 */
router.get('/commands/:user_id/vendor/historic', Authentication.authChecker, function (req, res, next) {
    let user_id = req.params.user_id;
    errorManager
        .isValidId(user_id)
        .then(function (response) {
            if (response.error) {
                errorManager.handler(res, response.data, "error is validId")
            } else {
                let userId = mongoose.Types.ObjectId(user_id); // formmated iD
                User
                    .findOne({_id: userId}, function (err, user) {
                        if (err) {
                            errorManager.handler(res, err, "error user findOne")
                        } else {
                            if (user) {
                                CmdHistorique
                                    .find({vendor: userId, status: "ready"})
                                    .populate('user products')
                                    .then(function (commandsHistoriques) {
                                        console.log("CMD HISTORIQUE FOR VENDOR", commandsHistoriques)
                                        if (commandsHistoriques) {
                                            res.status(200).json({
                                                "data": commandsHistoriques,
                                                "status": 200
                                            })
                                        } else {
                                            errorManager.handler(res, "commands historique empty", "no commands historique.")
                                        }
                                    })
                                    .catch(function (err) {
                                        errorManager.handler(res, err, "find commands historique error")
                                    })
                            } else {
                                error.handler(res, "user not found.", "no user for this _id given")
                            }
                        }
                    })
            }
        })
        .catch(function (err) {
            errorManager.handler(res, err, "isValidId error")
        });
});


/**
 * Add to hsitoric the command (vendor or user)
 */
router.put('/commands/archived', Authentication.authChecker, function (req, res, next) {
    let payload = req.body;
    let date = new Date(); // ready at
    console.log(payload.command._id);
    errorManager
        .isValidId(payload.command._id)
        .then(function (response) {
            if (response.error) {
                console.log(response.data)
                errorManager
                    .handler(res, response.data, "error _id validation")
            } else {
                let commandId = mongoose.Types.ObjectId(payload.command._id);
                console.log(commandId);
                Command
                    .updateOne({_id: commandId}, {$set: {ready_at: date, status: 'ready'}})
                    .then(function (message) {
                        let clr = payload.command;
                        delete clr._id;
                        let newCmdHist = new CmdHistorique(clr);
                        newCmdHist.ready_at = date;
                        newCmdHist.status = 'ready';
                        newCmdHist.vendor = payload.command.vendor;
                        newCmdHist.save(function (err) {
                            if (err) {
                                console.log("CMD HIST ", err)
                                errorManager
                                    .handler(res, err, "error save cmdHist")
                            } else {
                                console.log(commandId);
                                Command
                                    .findOne({_id: commandId}, function (err, command) {
                                        console.log("cmdf", command)
                                        if (err) {
                                            console.log("COMMAND find one", err)
                                            errorManager
                                                .handler(res, err, "error find one command")
                                        } else {
                                            command.remove(function (err, removedCommand) {
                                                if (err) {
                                                    console.log("COMMAND REMOVE", err)
                                                    errorManager
                                                        .handler(res, err, "error remove command")
                                                } else {
                                                    res
                                                        .status(200)
                                                        .json({
                                                            'data': 'Updated with success',
                                                            'status': 200
                                                        })
                                                }
                                            })
                                        }
                                    })
                            }
                        })

                    })
                    .catch(err => errorManager
                        .handler(res, err, "error update"))
            }
        })
        .catch(err => errorManager.handler(res, err, "error"))
    /*
    console.log('_id',payload.command._id);
    console.log(payload.command.identifier)
    errorManager
        .isValidId(payload.command._id)
        .then(function (response) {
            if (response.error) {
                console.log("eaz",response.error);
                errorManager.handler(res, response.data, "error isvalidid")
            } else {
                let commandId = mongoose.Types.ObjectId(payload._id);
                let date = new Date();
                const status = "ready";
                console.log(commandId);
                Command.findOne({_id: commandId}, function (err, command) {
                    console.log("ex",err);
                    console.log("cmd", command)
                    command.ready_at = date;
                    command.status = status;
                    command.save(function (err) {
                        if (err) {
                            console.log("ERRR", err);
                            errorManager
                                .handler(res, err, "error save command")
                        } else {
                            res
                                .status(200)
                                .json({
                                    data: command,
                                    status: 200
                                })
                        }
                    });
                });
            }
        })
        .catch(err => errorManager.handler(res, err, "error"))
        */

});


/*
router.get('/commands/:user_id/vendor/prepare', Authentication.authChecker, function (req, res, next) {
    let user_id = req.params.user_id;
    errorManager
        .isValidId(user_id)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, response.data, "error is validId")
            } else {
                let userId = mongoose.Types.ObjectId(user_id);
                Store //get all offer created by this user (available in his stores)
                    .find({owner: userId})
                    .then(function (stores) {
                        let initAllProductsId = [];
                        let allProductsId = [];
                        for (let x in stores) {
                            if (x == 0) {
                                initAllProductsId = stores[x].products;
                            } else {
                                allProductsId = initAllProductsId.concat(stores[x].products)
                            }
                        }

                        let owner_products = [];
                        Command
                            .find({ready_at: null, status: 'prepare'})
                            .populate('products')
                            .then(function (commands) {
                                //console.log("cmds", commands);
                                //console.log("cmds _ lt", commands.length);
                                //console.log("user id ", userId)
                                // console.log(typeof user_id)
                                for (let x in commands) {
                                    //console.log("x : i ", x, i)
                                    //console.log("-------- x --------", x)
                                    for (let idx = 0; idx < commands[x].products.length; idx++) {
                                        //console.log(userId instanceof mongoose.Types.ObjectId)
                                        if (commands[x].products[idx].owner == user_id) {
                                            //quantities[commands[x].products[idx].owner]['quantity'] += 1;
                                            //console.log("ID : ", commands[x].products[idx]._id)
                                            //owner_products.push(commands[x].products[idx]._id)
                                            owner_products.push(commands[x].products[idx])
                                        }
                                    }

                                    //console.log("--------------------------")
                                }

                                //console.log(owner_products);
                                res
                                    .status(200)
                                    .json({
                                        "data": owner_products,
                                        "status": 200});
                            })
                            .catch(err => errorManager.handler(res, err, "error find commmand"))

                    })
                    .catch(function (err) {
                        errorManager
                            .handler(res, err, "error find all stores");
                    });
            }
        })
        .catch(function (err) {
            errorManager
                .handler(res, err, "error isValidId");
        });

});
*/

router.post('/search', Authentication.authChecker, function (req, res, next) {
    let payload = req.body;

    let search_value = payload.search_value;

    let replace = search_value;
    let reg = new RegExp(replace, "g");

    let categoriesResult = [];

    Store
        .find({"name": {$regex: '.*' + search_value + '.*'}})
        .exec(function (err, stores) {
            if (err) {
                console.log(err);
                errorManager
                    .handler(res, err, "error find all with $regex")
            } else {
                Store
                    .find({})
                    .populate('categories_store products')
                    .exec(function (err, storesGlobal) {
                        if (err) {
                            console.log(err);
                            errorManager
                                .handler(res, err, "error find all with $regex")
                        } else {
                            //search stores by categories name
                            for (let idx in storesGlobal) {
                                if (storesGlobal[idx].categories_store[0].name.match(reg)) {
                                    categoriesResult.push(storesGlobal[idx]);
                                }
                            }
                            let merge = [].concat(stores, categoriesResult);
                            let removeDuplicate = removeDuplicates(merge, '_id')
                            res.status(200).json({
                                "data": removeDuplicate,
                                "status": 200
                            });
                        }
                    });
            }
        });
});


router.post('/like', Authentication.authChecker, function (req, res, next) {
    let payload = req.body;
    errorManager
        .isValidIds([payload.store_id, payload.user_id])
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, response.data, "error isValidIds")
            } else {
                let storeId = mongoose.Types.ObjectId(payload.store_id);
                let userId = mongoose.Types.ObjectId(payload.user_id);

                StoreLike
                    .findOne({user: userId, store: storeId}, function (err, storeLike) {
                        if (err) {
                            console.log("ERR", err)
                            errorManager
                                .handler(res, err, "error")
                        } else {
                            if (storeLike !== null) {
                                //deja liké le store par l'user
                                console.log("OK 200 but dosnt add -> alredy exist")
                                res
                                    .status(200)
                                    .json({"data": "Déjà liké !", "exist": true, "status": 200})
                            } else {
                                let newStoreLike = new StoreLike({user: userId, store: storeId, created_at: new Date()})
                                newStoreLike.save(function (err) {
                                    if (err) {
                                        console.log("ERR save", err);
                                        errorManager
                                            .handler(res, err, "error newstorelike")
                                    } else {
                                        res
                                            .status(200)
                                            .json({"data": newStoreLike, "exist": false, "status": 200})
                                    }
                                })
                            }
                        }
                    })
            }
        })
        .catch(function (err) {
            console.log(err)
            errorManager
                .handler(res, err, "error is validIds")
        })
});


router.post('/product/picture', Authentication.authChecker, upload.single('product_picture'), function (req, res, next) {
    console.log('req.file', req.file);
    res.json(req.file);
});


router.get('/stats/:time', Authentication.authChecker, function (req, res, next) {
    let time = req.params.time;

    //today
    let startOfDay = Moment().startOf('day');
    let endOfDay = Moment().endOf('day');

    //week
    let startOfWeek = Moment().startOf('isoWeek');
    let endOfWeek = Moment().endOf('isoWeek');

    //month
    let startOfMonth = Moment().startOf('month');
    let endOfMonth = Moment().endOf('month');

    //year
    let startOfYear = Moment().startOf('year');
    let endOfYear = Moment().endOf('year');

    if (time === "today") {
        StoreLike
            .find({
                created_at: {
                    $gte: startOfDay,
                    $lt: endOfDay
                }
            })
            .then(function (storelikes) {
                CmdHistorique
                    .find({
                        ready_at: {
                            $gte: startOfDay,
                            $lt: endOfDay
                        }
                    })
                    .then(function (cmdhistorics) {
                        res.status(200).json({
                            "data": {
                                stats_like: storelikes,
                                stats_command: cmdhistorics
                            },
                            "status": 200
                        })
                    })
                    .catch(function (err) {
                        errorManager.handler(res, err, "find command")
                    });
            })
            .catch(function (err) {
                console.log("error", err);
                errorManager.handler(res, err, "error find storelike")
            })
    } else if (time === "week") {
        StoreLike
            .find({
                created_at: {
                    $gte: startOfWeek,
                    $lt: endOfWeek
                }
            })
            .then(function (storelikes) {
                CmdHistorique
                    .find({
                        ready_at: {
                            $gte: startOfWeek,
                            $lt: endOfWeek
                        }
                    })
                    .then(function (cmdhistorics) {
                        res.status(200).json({
                            "data": {
                                stats_like: storelikes,
                                stats_command: cmdhistorics
                            },
                            "status": 200
                        })
                    })
                    .catch(function (err) {
                        errorManager.handler(res, err, "find command")
                    });
            })
            .catch(function (err) {
                console.log("error", err);
                errorManager.handler(res, err, "error find storelike")
            })
    } else if (time === "month") {
        StoreLike
            .find({
                created_at: {
                    $gte: startOfMonth,
                    $lt: endOfMonth
                }
            })
            .then(function (storelikes) {
                CmdHistorique
                    .find({
                        ready_at: {
                            $gte: startOfMonth,
                            $lt: endOfMonth
                        }
                    })
                    .then(function (cmdhistorics) {
                        res.status(200).json({
                            "data": {
                                stats_like: storelikes,
                                stats_command: cmdhistorics
                            },
                            "status": 200
                        })
                    })
                    .catch(function (err) {
                        errorManager.handler(res, err, "find command")
                    });
            })
            .catch(function (err) {
                console.log("error", err);
                errorManager.handler(res, err, "error find storelike")
            })
    } else if (time === "year") {
        StoreLike
            .find({
                created_at: {
                    $gte: startOfYear,
                    $lt: endOfYear
                }
            })
            .then(function (storelikes) {
                CmdHistorique
                    .find({
                        ready_at: {
                            $gte: startOfYear,
                            $lt: endOfYear
                        }
                    })
                    .then(function (cmdhistorics) {
                        res.status(200).json({
                            "data": {
                                stats_like: storelikes,
                                stats_command: cmdhistorics
                            },
                            "status": 200
                        })
                    })
                    .catch(function (err) {
                        errorManager.handler(res, err, "find command")
                    });
            })
            .catch(function (err) {
                console.log("error", err);
                errorManager.handler(res, err, "error find storelike")
            })
    }
});

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

function compressObj(original) {

    //var compressed = [];
    var obj = {}
    // make a copy of the input array
    var copy = original.slice(0);

    // first loop goes over every element
    for (var i = 0; i < original.length; i++) {

        var myCount = 0;
        // loop over every element in the copy and see if it's the same
        for (var w = 0; w < copy.length; w++) {
            if (original[i] == copy[w]) {
                // increase amount of times dplicate is found
                myCount++;
                // sets item to undefined
                delete copy[w];
            }
        }

        if (myCount > 0) {
            //var a = new Object();
            //obj.value = original[i];
            obj[original[i]] = myCount;
            console.log("OBJECT", obj)
            //compressed.push(a);
        }
    }

    return obj;
};

module.exports = router;