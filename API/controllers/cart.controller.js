'use strict';

const Cart = require('../models/cart.model');
const error = require('../components/errors');
const _ = require('lodash');


// ADD controller for route index (show list carts)
exports.index = function (req, res) {
  let promise = [];
  let limit = req.query && req.query.limit || 0;
  let page = req.query && req.query.page || 0;

  // add promise find cart
  promise.push(Cart.find({})
    .populate('owner, product')
    .lean());

  // when promises resolve
  Promise.all(promise)
  //if not errors send json data
    .then(function (data) {
      let result = {};
      result.total = data[0];
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

// ADD controller show one cart id
exports.show = function (req, res) {
  // Promise find cart id db
  Cart.findById(req.params.id)
  // join owner with model defined in the model Cart
    .populate('owner, product')
    //if not errors send json data
    .then(function (data) {
      res.status(200).json(data);
    })
    // else send error
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

//controller create cart
exports.create = function (req, res) {
  let newCart = new Cart(req.body);

  // Promise new cart
  newCart
  //save cart
    .save()
    //if promise not errors send json data
    .then(function (cart) {
      res.status(201);
      res.json(cart);
    })
    // else send error and not save
    .catch(function (err) {
      err.code = 422;
      return error.handleError(res, err);
    });
};

//controller update cart
exports.update = function (req, res) {
  // add verification id cart
  // if not exit id cart return error 404
  if (!req.body._id) {
    throw error.generateError({
      code: 404,
      message: 'ERROR_CART_NOT_FOUND'
    });
  }

  // condition if this user allowed update cart
  /* if (!req._user || (req._user && _.isEmpty(req._user))) {
  // if not allowed return error
    throw error.generateError({
      code: 403,
      message: 'ERROR_USER_NOT_ALLOWED_TO_EDIT_CART'
    });
  } */

  // Promise find id cart db
  Cart.findById(req.params.id)
  // join owner cover
    .populate('owner, product')
    // if none error req findById cart
    // execute code
    .then(function (cart) {
      // if nof found cart
      if (!cart) {
        // return error
        throw error.generateError({
          code: 404,
          message: 'ERROR_CART_NOT_FOUND'
        });
      }
      /*if (req._user && cart.owner && req._user._id.toString() !== cart.owner.toString()) {
        throw error.generateError({
          code: 403,
          message: 'ERROR_USER_NOT_ALLOWED_TO_EDIT_CART'
        });
      }

      if (!cart.user && req._user && req._user.role !== 'admin') {
        cart.user = req._user._id;
      }*/

      let newCart = new Cart(cart);
      let updated = _.extend(newCart, req.body);

      // update cart if none error
      return updated.save();
    })
    .then(function (cart) {
      return Cart.populate(cart, []);
      // return Cart.populate(cart, ['owner', 'cover']);
    })
    .then(function (cart) {
      return res.status(200).json(cart);
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

// add controller destroy cart
exports.destroy = function (req, res) {
  Cart
    .findById(req.params.id)
    .then(function (cart) {
      if (!cart) {
        throw error.generateError({
          code: 404,
          message: 'ERROR_NOT_FOUND'
        });
      }
      return cart.remove();
    })
    .then(function () {
      return res.status(204).send('No Content');
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};