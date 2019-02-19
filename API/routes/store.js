const express = require('express');
const router = express.Router();
const errorManager = require('../services/errorManager');
const mongoose = require('mongoose');

const Store = require('../models/Store');

const Authentication = require('../middleware/Authentication');

const _ = require('lodash');

const axios = require('axios');
const mapquestapi = require('../config/mapquestapi').mapquestapi;
const error = require('../components/errors');
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
router.post('/', function (req, res, next) {
  let payload = req.body;
  if (!payload.city || !payload.address || !payload.zipcode) {
    errorManager
      .handler(res, "missing fields.", "check city, address, zipcode fields.")
  } else {
    let newStore = new Store(req.body);
    newStore.categories_store = [];
    newStore.categories_store.push(req.body.categories_store);

    newStore
      .save()
      .then(function (store) {
        return res.status(201).json(store);
      })
      // else send error and not save
      .catch(function (err) {
        err.code = 422;
        return error.handleError(res, err);
      });
    /*axios
        .get(`${mapquestapi.geocoding_uri}${encodeURIComponent(payload.city.trim())}, ${encodeURIComponent(payload.zipcode.trim())}, ${encodeURIComponent(payload.address.trim())}`)
        .then(function (response) {
          console.log(response);
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

        }).catch(err => console.log(err));*/
  }
});

/**
 * GET
 * list stores
 */
router.get('/', function (req, res, next) {

  let promise = [];
  let limit = req.query && req.query.limit || 0;
  let page = req.query && req.query.page || 0;
  let criteria = {};

  if (req.query.owner) {
    criteria.owner = req.query.owner;
  }

// add promise find product
  promise.push(Store
    .find(criteria)
    .populate('owner StorePicture categories_store')
    .lean());

// when promises resolve
  Promise.all(promise)
  //if not errors send json data
    .then(function (data) {
      console.log(data);
      let result = {};
      result.data = data[0];
      result.limit = parseInt(limit);
      result.page = parseInt(page);
      result.count = data[0].length;

      res.status(200).json(result);
    })
    // else send error
    .catch(function (err) {
      return errorManager.handler(res, err, "error find mongo");
    });
});

/**
 * GET
 * Store by id
 */
router.get('/:_id', function (req, res, next) {
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
router.delete('/', function (req, res, next) {
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
router.put('/', function (req, res, next) {
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

router.post('/test/pic', upload_store_pictures.single('file'), function (req, res, next) {
  res.json(req.files);
});

module.exports = router;


