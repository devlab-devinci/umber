const Product = require('../models/product.model');
const error = require('../components/errors');
const _ = require('lodash');

//Simple version, without validation or sanitation
exports.index = function (req, res) {
  let promise = [];
  let limit = req.query && req.query.limit || 0;
  let page = req.query && req.query.page || 0;

  promise.push(Product.find({})
    .populate('owner, cover, images')
    .lean());

  Promise.all(promise)
    .then(function (data) {
      let result = {};
      result.total = data[0];
      result.limit = parseInt(limit);
      result.page = parseInt(page);
      result.count = data[0].length;

      res.status(200).json(result);
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

exports.show = function (req, res) {
  Product.findById(req.params.id)
    .populate('owner, cover, images')
    .then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

exports.create = function (req, res) {
  let newProduct = new Product(req.body);

  newProduct
    .save()
    .then(function (product) {
      res.status(201);
      res.json(product);
    })
    .catch(function (err) {
      err.code = 422;
      return error.handleError(res, err);
    });
};

exports.update = function (req, res) {
  if (!req.body._id) {
    throw error.generateError({
      code: 404,
      message: 'ERROR_PRODUCT_NOT_FOUND'
    });
  }

  /* if (!req._user || (req._user && _.isEmpty(req._user))) {
    throw error.generateError({
      code: 403,
      message: 'ERROR_USER_NOT_ALLOWED_TO_EDIT_PRODUCT'
    });
  } */

  Product.findById(req.params.id)
    .populate('owner, cover')
    .then(function (product) {
      if (!product) {
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
      let updated = _.extend(newProduct, req.body);

      return updated.save();
    })
    .then(function (product) {
      return Product.populate(product, []);
      // return Product.populate(product, ['owner', 'cover']);
    })
    .then(function (product) {
      return res.status(200).json(product);
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

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