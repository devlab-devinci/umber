const express = require('express');
const router = express.Router();
const errorManager = require('../services/errorManager');
const mongoose = require('mongoose');

const CategoryStore = require('../models/CategoryStore');
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


module.exports = router;
