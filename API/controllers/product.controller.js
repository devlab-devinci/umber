'use strict';

const Product = require('../models/product.model');
const Document = require('../models/document.model');
const error = require('../components/errors');
const _ = require('lodash');
const config = require('../config');
const upload = require('../components/uploads');


// ADD controller for route index (show list products)
exports.index = function (req, res) {

  let promise = [];
  let limit = req.query && req.query.limit || 0;
  let page = req.query && req.query.page || 0;
  let criteria = {};

  if (req.query.owner) {
    criteria.owner = req.query.owner;
  }

  if (req.query.store) {
    criteria.store = req.query.store;
  }

// add promise find product
  promise.push(Product
    .find(criteria)
    .populate('store owner cover categories')
    .lean());

// when promises resolve
  Promise.all(promise)
  //if not errors send json data
    .then(function (data) {
      let result = {};
      result.data = data[0];
      result.limit = parseInt(limit);
      result.page = parseInt(page);
      result.count = data[0].length;

      res.status(200).json(result);
    })
    // else send error
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

// ADD controller show one product id
exports.show = function (req, res) {
  // Promise find product id db
  Product.findById(req.params.id)
  // join owner with model defined in the model Product
    .populate('store owner cover categories')
    //if not errors send json data
    .then(function (data) {
      res.status(200).json(data);
    })
    // else send error
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

//controller create product
exports.create = function (req, res) {
  let saveProduct = function (newDocument) {
    let newProduct = new Product(req.body);

    if (newDocument) {
      newProduct.cover = newDocument;
    }

    newProduct
      .save()
      .then(function (product) {
        return res.status(201).json(product);
      })
      // else send error and not save
      .catch(function (err) {
        err.code = 422;
        return error.handleError(res, err);
      });
  };

  if (req.files && req.files[0].filename) {
    upload.any()(req, res, (err) => {
      if (err) {
        return res.end('error request file');
      }

      let fullPath = config.upload.path + '/' + req.files[0].filename;

      let newDocument = new Document ({
        path: fullPath,
        name: req.files[0].filename,
        originalName: req.files[0].originalname,
        type: req.files[0].mimetype
      });

      newDocument
        .save()
        .then(function () {
          saveProduct(newDocument);
        })
        // else send error and not save
        .catch(function (err) {
          err.code = 422;
          return error.handleError(res, err);
        });
    });
  }
  else {
    saveProduct();
  }
};

//controller update product
exports.update = function (req, res) {

  console.log(req.files);
  console.log(req.body);

  // add verification id product
  // if not exit id product return error 404
  if (!req.body._id) {
    throw error.generateError({
      code: 404,
      message: 'ERROR_PRODUCT_NOT_FOUND'
    });
  }
  // condition if this user allowed update product
  /* if (!req._user || (req._user && _.isEmpty(req._user))) {
  // if not allowed return error
    throw error.generateError({
      code: 403,
      message: 'ERROR_USER_NOT_ALLOWED_TO_EDIT_PRODUCT'
    });
  } */
  let saveProduct = function (newDocument) {

    // Promise find id product db
    Product.findById(req.params.id)
    // join owner cover
      .populate('store owner cover categories')
      // if none error req findById product
      // execute code
      .then(function (product) {
        // if nof found product
        if (!product) {
          // return error
          throw error.generateError({
            code: 404,
            message: 'ERROR_PRODUCT_NOT_FOUND'
          });
        }
        /*if (req._user && product.owner && req._user._id.toString() !== product.owner.toString()) {
          throw error.generateError({
            code: 403,
            message: 'ERROR_USER_NOT_ALLOWED_TO_EDIT_PRODUCT'
          });
        }

        if (!product.user && req._user && req._user.role !== 'admin') {
          product.user = req._user._id;
        }*/
        let newProduct = new Product(product);

        if (newDocument) {
          newProduct.cover = newDocument;
        }

        let updated = _.extend(newProduct, req.body);

        // update product if none error
        return updated.save();
      })
      .then(function (product) {
        return Product.populate(product, [
          {path: 'owner'},
          {path: 'cover'},
          {path: 'categories'}
        ]);
      })
      .then(function (product) {
        return res.status(200).json(product);
      })
      .catch(function (err) {
        return error.handleError(res, err);
      });
  };

  if (req.files && req.files[0].filename) {
    upload.any()(req, res, (err) => {
      if (err) {
        return res.end('error request file');
      }

      let fullPath = config.upload.path + '/' + req.files[0].filename;

      let newDocument = new Document ({
        path: fullPath,
        name: req.files[0].filename,
        originalName: req.files[0].originalname,
        type: req.files[0].mimetype
      });

      newDocument
        .save()
        .then(function () {
          saveProduct(newDocument);
        })
        // else send error and not save
        .catch(function (err) {
          err.code = 422;
          return error.handleError(res, err);
        });
    });
  }
  else {
    saveProduct();
  }
};

// add controller destroy product
exports.destroy = function (req, res) {
  Product
    .findById(req.params.id)
    .then(function (product) {
      if (!product) {
        throw error.generateError({
          code: 404,
          message: 'ERROR_NOT_FOUND'
        });
      }
      return product.remove();
    })
    .then(function () {
      return res.status(204).send('No Content');
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};
