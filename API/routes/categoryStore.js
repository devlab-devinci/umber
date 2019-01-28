const express = require('express');
const router = express.Router();
const errorManager = require('../services/errorManager');
const mongoose = require('mongoose');

const CategoryStore = require('../models/CategoryStore');
const CategoryStorePicture = require('../models/CategoryStorePicture');


// upload picture for category store
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const mime = require('mime');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/category_store/pictures')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
        });
    }
});

const upload_categoryStore_picture = multer({storage: storage})


/**
 * POST
 * Add new category for store
 * RULES :
 *  - If name already exist => return error
 */
router.post('/category', function (req, res, next) {

    let payload = req.body;

    if (!payload.name || typeof payload.name !== 'string') {
        errorManager.handler(res, "name missing (expected string)", "field name is missing.")
    } else {

        CategoryStore
            .findOne({'name': payload.name}, function (err, categoryStore) {
                if (err) {
                    errorManager.handler(res, err, "findOne failed.")
                } else {
                    if (categoryStore) {
                        errorManager.handler(res, ` category store with name : ${payload.name} already exist`, "name already taken.")
                    } else {
                        let newCategoryStore = new CategoryStore({
                            name: payload.name
                        });

                        newCategoryStore.save(function (err) {
                            if (err) {
                                return errorManager.handler(res, err, "save methods failed.");
                            } else {
                                res
                                    .status(200)
                                    .json({"data": payload, "message": "inserted with success.", "status": 200})
                            }
                        });
                    }
                }
            });

    }

});

/**
 * DELETE
 * Delete category for store by id
 */
router.delete('/category', function (req, res, next) {
    let payload = req.body;

    if (payload._id && typeof payload._id === 'string') {
        if (payload._id.length === 24) {
            let objectId = mongoose.Types.ObjectId(payload._id); //cast string to objectId mongoose

            CategoryStore.deleteOne({_id: objectId}, function (err) {
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
 * Update category for store by id
 */
router.put('/category', function (req, res, next) {
    let payload = req.body;

    if (payload.name && typeof payload.name === 'string') {
        if (payload._id && typeof payload._id === 'string') {
            if (payload._id.length === 24) {
                let objectId = mongoose.Types.ObjectId(payload._id); //cast string to objectId mongoose

                CategoryStore
                    .findOne({'_id': objectId}, function (err, categoryStore) {
                        if (err) {
                            //cannot find one error mongo
                            errorManager.handler(res, err, "findOne failed.")
                        } else {
                            if (categoryStore) {
                                CategoryStore
                                    .update({_id: payload._id}, {$set: {name: payload.name}}, function (err, categoryUpdated) {
                                        if (err) {
                                            //cannot update error mongo
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
                                    });
                            } else {
                                //error category not found
                                errorManager.handler(res, ` category not found`, "category dosnt exist.")
                            }
                        }
                    });

            } else {
                //error invalid mongo objectId
                errorManager.handler(res, "_id must be 24 characters to be a valid objectId", "Cannot cast _id given string to objectId mongo")
            }
        } else {
            //error field _id empty
            errorManager.handler(res, "_id is missing", "field _id is missing.")
        }
    } else {
        //error field name empty
        errorManager.handler(res, "name is missing", "field name is missing.")
    }

});


/**
 * GET
 * Find one by id
 */
router.get('/category/:id', function (req, res, next) {
    let params_id = req.params.id;

    if (params_id && typeof params_id === 'string') {
        if (params_id.length === 24) {
            let objectId = mongoose.Types.ObjectId(params_id); //cast string to objectId mongoose
            CategoryStore
                .findOne({'_id': objectId})
                .populate('CategoryStorePicture')
                .exec(function (err, categoryStore) {
                    if (err) {
                        errorManager.handler(res, err, "findOne failed.")
                    } else {
                        res
                            .status(200)
                            .json({
                                "data": categoryStore,
                                "message": "show by id success.",
                                "status": 200
                            })
                    }
                })
        } else {
            errorManager.handler(res, 'invalid length _id (24 characters for valid mongoId', 'invalid _id format')
        }
    } else {
        errorManager.handler(res, '_id not given expected mongoId', 'missing field _id')
    }
});

/**
 * GET
 * Find all category
 */
router.get('/category', function (req, res, next) {
    CategoryStore
        .find({})
        .populate('CategoryStorePicture')
        .exec(function (err, categories) {
            if (err) {
                errorManager.handler(res, err, "find failed.")
            } else {
                res
                    .status(200)
                    .json({
                        "data": categories,
                        "message": "show all success.",
                        "status": 200
                    })
            }
        })
});

/**
 * Add picture to category
 */
router.post('/category/picture', upload_categoryStore_picture.single('picture'), function (req, res, next) {
    let payload = req.body;
    if (payload._id && typeof payload._id === 'string') {
        if (payload._id.length === 24) {
            let objectId = mongoose.Types.ObjectId(payload._id); //cast string to objectId mongoose

            CategoryStore
                .findOne({'_id': objectId}, function (err, categoryStore) {
                    if (err) {
                        errorManager.handler(res, err, "findOne failed.")
                    } else {
                        let newCategoryPicture = new CategoryStorePicture();
                        newCategoryPicture.img.data = fs.readFileSync(req.file.path)
                        newCategoryPicture.img.contentType = "image/png";
                        newCategoryPicture.save(function (err) {
                            if (err) {
                                errorManager.handler(res, err, "save newCategoryPicture")
                            } else {
                                categoryStore
                                    .picture = mongoose.Types.ObjectId(newCategoryPicture._id)
                                categoryStore.save(function (err) {
                                    if (err) {
                                        errorManager.handler(res, err, "error save categoryStore with new picture")
                                    } else {
                                        res
                                            .status(200)
                                            .json({
                                                "data": categoryStore,
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

module.exports = router;
