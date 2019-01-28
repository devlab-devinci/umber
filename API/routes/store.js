const express = require('express');
const router = express.Router();
const errorManager = require('../services/errorManager');
const mongoose = require('mongoose');

const Store = require('../models/Store');


const Authentication = require('../middleware/Authentication');

/**
 * POST
 * Add new store
 */
router.post('/store', Authentication.hasRole("API_USER"), function (req, res, next) {
    let payload = req.body;


    let newStore = new Store(payload);
    newStore.created_at = Date.now();
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
});

/**
 * GET
 * list stores
 */
router.get('/store', function (req, res, next) {
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
                .populate('StorePicture')
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

//TODO update
//TODO add picture
// TODO remove or add picture in fields pictures: []


module.exports = router;


