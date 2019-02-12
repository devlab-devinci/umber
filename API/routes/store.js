const express = require('express');
const router = express.Router();
const errorManager = require('../services/errorManager');
const mongoose = require('mongoose');

const Store = require('../models/Store');
const StorePicture = require('../models/StorePicture');
const Product = require('../models/product.model');
const StoreCategory = require('../models/CategoryStore');

const Authentication = require('../middleware/Authentication');

const _ = require('lodash');

const axios = require('axios');
const mapquestapi = require('../config/mapquestapi').mapquestapi;

// upload
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const mime = require('mime');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/store/pictures')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
        });
    }
});

const upload_store_pictures = multer({storage: storage});


/**
 * POST
 * Add new store
 */
router.post('/store', Authentication.authChecker, function (req, res, next) {
    let payload = req.body;
    let category_id = "";

    if (!payload.city || !payload.address || !payload.zipcode) {
        errorManager
            .handler(res, "missing fields.", "check city, address, zipcode fields.")
    } else {
        errorManager
            .isValidId(payload.category_id)
            .then(function (response) {
                if (response.error) {
                    errorManager
                        .handler(res, "not valid id.", "invalid id for _id cast")
                } else {
                    category_id = mongoose.Types.ObjectId(payload.category_id);

                    let newStore = new Store(payload);
                    axios
                        .get(`${mapquestapi.geocoding_uri}${encodeURIComponent(payload.city.trim())}, ${encodeURIComponent(payload.zipcode.trim())}, ${encodeURIComponent(payload.address.trim())}`)
                        .then(function (response) {
                            if (response.data.results) {
                                let mapUrl = response.data.results[0].locations[0].mapUrl;
                                let mapLat = response.data.results[0].locations[0].latLng.lat.toString();
                                let mapLong = response.data.results[0].locations[0].latLng.lng.toString();
                                newStore.created_at = Date.now();
                                newStore.mapQuestMapPictureUrl = mapUrl;
                                newStore.mapQuestLat = mapLat;
                                newStore.mapQuestLng = mapLong;
                                newStore.categories_store.push(category_id);
                                newStore
                                    .save(function (err) {
                                        if (err) {
                                            errorManager.handler(res, err, "error save mongo")
                                        } else {
                                            res
                                                .status(200)
                                                .json({
                                                    "data": newStore,
                                                    "message": "store added with success",
                                                    "status": 200
                                                })
                                        }
                                    })
                            } else {
                                errorManager.handler(res, response, "map quest error")
                            }

                        }).catch(err => console.log(err));
                }
            })
            .catch(err => errorManager.handler(res, err, "error isValidId"))
        //convert to objectId
    }


});

/**
 * GET
 * list stores
 */
router.get('/store', Authentication.authChecker, function (req, res, next) {
    Store
        .find({})
        .populate('StorePicture')
        .exec(function (err, stores) {
            if (err) {
                errorManager.handler(res, err, "error find mongo")
            } else {
                if (stores) {
                    res
                        .status(200)
                        .json({
                            "data": stores,
                            "message": "stores list success",
                            "status": 200
                        })
                } else {
                    errorManager.handler(res, "no stores found.", "stores is empty")
                }
            }
        })
});

/**
 * GET
 * Store by id
 */
router.get('/store/:_id', function (req, res, next) {
    let paramId = req.params._id;
    if (paramId && typeof paramId === 'string') {
        if (paramId.length !== 24) {
            errorManager.handler(res, "wrong _id format for cast", "lenght _id wrong (must be 24)")
        } else {
            Store
                .findOne({'_id': mongoose.Types.ObjectId(paramId)})
                .populate('categories_store pictures products')
                .exec(function (err, store) {
                    if (err) {
                        errorManager.handler(res, err, "error find mongo")
                    } else {
                        if (store) {
                            res
                                .status(200)
                                .json({
                                    "data": store,
                                    "message": "store found with success",
                                    "status": 200
                                })
                        } else {
                            errorManager.handler(res, "no store found.", "store is empty")
                        }
                    }
                })
        }
    } else {
        errorManager.handler(res, "wrong _id format for cast", "lenght _id wrong (must be 24 and type string)")
    }

});


/**
 * DELETE
 * Delete store by id
 */
router.delete('/store', function (req, res, next) {
    let payload = req.body;

    if (payload._id && typeof payload._id === 'string') {
        if (payload._id.length === 24) {
            let objectId = mongoose.Types.ObjectId(payload._id); //cast string to objectId mongoose

            Store.deleteOne({_id: objectId}, function (err) {
                if (err) {
                    errorManager.handler(res, err, "deleteOne failed.")
                } else {
                    res
                        .status(200)
                        .json({"data": payload, "message": "deleted with success.", "status": 200})
                }
            });
        } else {
            //error invalid mongo objectId
            errorManager.handler(res, "_id must be 24 characters to be a valid objectId", "Cannot cast _id given string to objectId mongo")
        }
    } else {
        //error field empty
        errorManager.handler(res, "_id is missing", "field _id is missing.")
    }
});

/**
 * PUT
 * Update store by id
 */
router.put('/store', function (req, res, next) {
    let payload = req.body;

    if (payload._id && typeof payload._id === 'string') {
        if (payload._id.length === 24) {
            let objectId = mongoose.Types.ObjectId(payload._id); //cast string to objectId mongoose
            Store
                .findOne({'_id': objectId}, function (err, store) {
                    if (err) {
                        errorManager.handler(res, err, "find one error - PUT")
                    } else {
                        if (store) {
                            Store
                                .updateOne({_id: objectId}, {$set: payload}, function (err, storeUpdated) {
                                    if (err) {
                                        //cannot update error mongo
                                        errorManager
                                            .handler(res, err, "Update failed.")
                                    } else {
                                        res
                                            .status(200)
                                            .json({
                                                "data": storeUpdated,
                                                "message": "updated with success.",
                                                "status": 200
                                            })
                                    }
                                });
                        } else {
                            errorManager.handler(res, "store not found", "no store found for id given")
                        }
                    }
                });

        } else {
            errorManager.handler(res, "_id must be 24 characters to be a valid objectId", "Cannot cast _id given string to objectId mongo")
        }
    } else {
        errorManager.handler(res, "_id is missing (string)", "field _id is missing.")
    }

});

/**
 * POST
 * Add new picture for storePicture
 */
router.post('/store/picture', upload_store_pictures.single('picture'), function (req, res, next) {
    let payload = req.body;
    if (payload._id && typeof payload._id === 'string') {
        if (payload._id.length === 24) {
            let objectId = mongoose.Types.ObjectId(payload._id); //cast string to objectId mongoose

            Store
                .findOne({'_id': objectId}, function (err, store) {
                    if (err) {
                        errorManager.handler(res, err, "findOne failed.")
                    } else {
                        let newStorePicture = new StorePicture();
                        newStorePicture.img.data = fs.readFileSync(req.file.path);
                        newStorePicture.img.contentType = "image/png";
                        newStorePicture.save(function (err) {
                            if (err) {
                                errorManager.handler(res, err, "save error for newStorePicture")
                            } else {
                                store.pictures.push(mongoose.Types.ObjectId(newStorePicture._id));
                                store.save(function (err) {
                                    if (err) {
                                        errorManager.handler(res, err, "error save store with new picture")
                                    } else {
                                        res
                                            .status(200)
                                            .json({
                                                "data": store,
                                                "message": "picture added with success",
                                                "status": 200
                                            })
                                    }
                                })
                            }
                        });


                    }
                });
        } else {
            //error invalid mongo objectId
            errorManager.handler(res, "_id must be 24 characters to be a valid objectId", "Cannot cast _id given string to objectId mongo")
        }
    } else {
        //error field empty
        errorManager.handler(res, "_id is missing", "field _id is missing.")
    }
});

/**
 * POST
 * Add severals new pictures to one store
 * LIMIT 6 pictures
 */
router.post('/store/pictures', upload_store_pictures.array('pictures', 6), function (req, res, next) {
    let payload = req.body;
    let newPictures = [];
    if (payload._id && typeof payload._id === 'string') {
        if (payload._id.length === 24) {
            let objectId = mongoose.Types.ObjectId(payload._id); //cast string to objectId mongoosee
            Store.findOne({'_id': objectId}, function (err, store) {
                if (err) {
                    errorManager.handler(res, err, "store find One error")
                } else {
                    if (store) {
                        for (let i in req.files) {
                            let newStorePicture = new StorePicture();
                            newStorePicture.img.data = fs.readFileSync(req.files[i].path);
                            newStorePicture.img.contentType = "image/png";
                            newPictures.push(newStorePicture._id)
                        }
                        for (let x in newPictures) {
                            store.pictures.push(newPictures[x]._id)
                        }
                        store
                            .save(function (err) {
                                if (err) {
                                    errorManager.handler(res, err, "store add pictures failed.")
                                } else {
                                    res
                                        .status(200)
                                        .json({
                                            "data": store,
                                            "message": "pictures added with success",
                                            "status": 200
                                        })
                                }
                            });
                    } else {
                        errorManager.handler(res, "store not found", "store dosnt exist")
                    }

                }
            });

        } else {
            //error invalid mongo objectId
            errorManager.handler(res, "_id must be 24 characters to be a valid objectId", "Cannot cast _id given string to objectId mongo")
        }
    } else {
        //error field empty
        errorManager.handler(res, "_id is missing", "field _id is missing.")
    }
});


/**
 * DELETE
 * Remove 1 picture from 1 store
 */
router.delete('/store/pictures', function (req, res, next) {
    let store_id = req.body.storeId;

    /**
     * Array of string id (mongo for $pull and $in)
     */
    let storePictures_id = req.body.picturesId;
    let storePictures_objectId = [];

    //convert string into ObjectId mong
    for (let i in storePictures_id) {
        storePictures_objectId.push(mongoose.Types.ObjectId(storePictures_id[i]))
    }

    Store
        .findOne({'_id': store_id}, function (err, store) {
            if (err) {
                errorManager.handler(res, err, "err find one found")
            } else {
                if (store) {
                    Store
                        .updateOne({_id: store_id}, {
                            $pull: {
                                'pictures':
                                    {
                                        $in: storePictures_objectId
                                    }
                            }
                        }, function (err, storeUpdated) {
                            if (err) {
                                errorManager.handler(res, err, "store remove pictures failed.")
                            } else {
                                res
                                    .status(200)
                                    .json({
                                        "data": storeUpdated,
                                        "message": "pictures from store removed with success",
                                        "status": 200
                                    })
                            }
                        });

                } else {
                    errorManager.handler(res, "store not found", "store dosnt exist")
                }
            }
        });
});


/**
 * POST
 * Add one product to store
 */
router.post('/store/product', function (req, res, next) {
    let payload = req.body;
    let _ids = [payload.store_id, payload.product_id];
    errorManager
        .isValidIds(_ids)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, response.data, "error isValidId")
            } else {
                let objectIdProduct = mongoose.Types.ObjectId(payload.product_id);
                let objectIdStore = mongoose.Types.ObjectId(payload.store_id);

                Product
                    .findOne({
                        '_id': objectIdProduct
                    })
                    .exec(function (err, product) {
                        if (err) {
                            errorManager
                                .handler(res, err, "error FindOne product")
                        } else {
                            if (product) {
                                Store
                                    .findOne({'_id': objectIdStore})
                                    .exec(function (err, store) {
                                        if (err) {
                                            errorManager
                                                .handler(res, err, "findOne store error");
                                        } else {
                                            if (store) {
                                                errorManager
                                                    .checkDuplicated(objectIdProduct, store.products)
                                                    .then(function (response) {
                                                        if (response.error) {
                                                            errorManager
                                                                .handler(res, response.data, "checkDuplicated failed")
                                                        } else {
                                                            store.products.push(product)
                                                            store.save(function (err) {
                                                                if (err) {
                                                                    errorManager
                                                                        .handler(res, err, "store save error")
                                                                } else {
                                                                    res.status(200)
                                                                        .json({
                                                                            "data": store,
                                                                            "message": "product added with success",
                                                                            "status": 200
                                                                        })
                                                                }
                                                            })
                                                        }
                                                    })
                                                    .catch(err => errorManager.handler(res, err, "checkDuplicated failed."))
                                            } else {
                                                errorManager
                                                    .handler(res, "sotre dosnt exist for this id", "store not found");
                                            }
                                        }
                                    })
                            } else {
                                errorManager
                                    .handler(res, "product is empty", "product not found for this id")
                            }
                        }
                    })


            }
        })
        .catch(function (err) {
            errorManager
                .handler(res, err, "isValidIds failed.")
        })
});


/**
 * DELETE
 * Delete on product from store
 */
router.delete('/store/product', function (req, res, next) {
    let payload = req.body;
    let _ids = [payload.store_id, payload.product_id];
    errorManager
        .isValidIds(_ids)
        .then(function (response) {
            if (response.error) {
                errorManager
                    .handler(res, response.data, "error isValidId")
            } else {
                let objectIdProduct = mongoose.Types.ObjectId(payload.product_id);
                let objectIdStore = mongoose.Types.ObjectId(payload.store_id);

                Product
                    .findOne({
                        '_id': objectIdProduct
                    })
                    .exec(function (err, product) {
                        if (err) {
                            errorManager
                                .handler(res, err, "error FindOne product")
                        } else {
                            if (product) {
                                Store
                                    .findOne({'_id': objectIdStore})
                                    .exec(function (err, store) {
                                        if (err) {
                                            errorManager
                                                .handler(res, err, "findOne store error");
                                        } else {
                                            if (store) {
                                                _.remove(store.products, objectIdProduct)
                                                store.save(function (err) {
                                                    if (err) {
                                                        errorManager
                                                            .handler(res, err, "store save error")
                                                    } else {
                                                        res.status(200)
                                                            .json({
                                                                "data": store,
                                                                "message": "product removed with success",
                                                                "status": 200
                                                            })
                                                    }
                                                })
                                            } else {
                                                errorManager
                                                    .handler(res, "sotre dosnt exist for this id", "store not found");
                                            }
                                        }
                                    })
                            } else {
                                errorManager
                                    .handler(res, "product is empty", "product not found for this id")
                            }
                        }
                    })


            }
        })
        .catch(function (err) {
            errorManager
                .handler(res, err, "isValidIds failed.")
        })
});


router.get('/:name/category/store', function (req, res, next) {
    let paramName = req.params.name;
    StoreCategory
        .findOne({'name': paramName})
        .populate('categories_store pictures products')
        .exec(function (err, store) {
            if (err) {
                errorManager.handler(res, err, "error find mongo")
            } else {
                if (store) {
                    res
                        .status(200)
                        .json({
                            "data": store,
                            "message": "store found with success",
                            "status": 200,
                            "error": false
                        })
                } else {
                    errorManager.handler(res, "no store found.", "store is empty")
                }
            }
        })

})


router.post('/test/pic', upload_store_pictures.single('file'), function (req, res, next) {
    res.json(req.files);
})

module.exports = router;


