'use strict';

const Cart = require('../models/cart.model');
const User = require('../models/Users');
const error = require('../components/errors');
const _ = require('lodash');


// ADD controller for route index (show list carts)
exports.index = function (req, res) {
  let promise = [];
  let limit = req.query && req.query.limit || 0;
  let page = req.query && req.query.page || 0;
  let regex;
  let criteria = {};

  if (req.query.seller) {
    criteria.seller = req.query.seller;
  }

  if (req.query.buyer) {
    criteria.buyer = req.query.buyer;
  }

  if (req.query.search) {
    regex = new RegExp(req.query.search, 'i');

    criteria.$or = [
      { 'persons.firstName': regex },
      { 'persons.lastName': regex },
      { 'persons.email': regex },
      { 'persons.phone': regex },
      { companyName: regex }
    ]
    User.find(criteria).select('_id').lean()
  }


  // add promise find cart
  promise.push(Cart.find(criteria)
    .populate('buyer seller')
    .populate('documents.receipt documents.delivery documents.credit')
    .populate('cartEntries.product')
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

// ADD controller show one cart id
exports.show = function (req, res) {
  let cartId = req.params.id;
  Cart
    .findById(cartId)
    .populate('buyer seller')
    .populate('documents.receipt documents.delivery documents.credit')
    .populate('cartEntries.product')
    .then(function (cart) {
      if (!cart) {
        throw error.generateError({
          code: 404,
          message: 'ERROR_CART_NOT_FOUND'
        });
      }
      res.status(200).json(cart);
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

//controller create cart
exports.create = function (req, res) {
  /*if (req.user.role !== 'admin' || !req.body.buyer) {
    req.body.buyer = req.user._id;
  }*/
  let promise = [];
  promise.push(Cart.find({seller: req.query.seller, buyer: req.query.buyer}).count);

  Promise.all(promise)
    .then(function (data) {
      if (data[0] <= 0 || !data[0]) {
        throw error.generateError({
          code: 403,
          message: 'ERROR_OWNER_AND_RECIPIENT_CART_ALREADY_EXIST'
        });
      }
      Cart.create(req.body)
        .then(function (cart) {
          return Cart.populate(cart, [
            {path: 'buyer', select: 'fullname email'},
            {path: 'seller', select: 'fullname companyName'},
            {path: 'cartEntries.product'},
            {path: 'documents.receipt'},
            {path: 'documents.delivery'},
            {path: 'documents.credit'}
          ]);
        })
        .then(function (cart) {
          cart = cart.toObject();
          return res.status(200).json(cart);
        })
        .catch(function (err) {
          return error.handleError(res, err);
        });
    })
    .catch(function (err) {
      return error.handleError(res, err);
    })
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
  // join buyer cover
    .populate('buyer seller cartEntries.product documents.receipt documents.delivery documents.credit')
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
      /*if (req._user && cart.buyer && req._user._id.toString() !== cart.buyer.toString()) {
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
      return Cart.populate(cart, [
        {path: 'buyer', select: 'fullname email'},
        {path: 'seller', select: 'fullname companyName'},
        {path: 'cartEntries.product'},
        {path: 'documents.receipt'},
        {path: 'documents.delivery'},
        {path: 'documents.credit'}
      ]);
      // return Cart.populate(cart, ['buyer', 'cover']);
    })
    .then(function (cart) {
      return res.status(200).json(cart);
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

exports.bySha = function (req, res) {
  Cart
    .findOne({ sha: req.params.sha })
    .select('-documents')
    .populate('buyer sellers', 'username companyName address')
    .lean()
    .then(function (cart) {
      if (!cart) {
        throw error.generateError({
          code: 404,
          message: 'ERROR_CART_NOT_FOUND'
        });
      }
      res.json(cart);

      if (!req.user || req.user._id.toString() !== cart.buyer._id.toString()) {
        Cart.update({ _id: cart._id }, { $inc: { views: 1 }}).exec();
      }
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

/* exports.remind = function(req, res) {
  Cart.findById(req.params.id)
    .populate('seller.user')
    .populate('buyer')
    .then(function (c) {
      let msgVars = {};

      if (req.user.role !== 'admin' && c.buyer._id.toString() !== req.user._id.toString()) {
        throw error.generateError({
          code: 403,
          message: 'ERROR_FORBIDDEN'
        });
      }

      msgVars.user = c.seller.user;
      msgVars.buyer = c.buyer;
      msgVars.buyer.firstName = c.buyer.persons[0].firstName;
      msgVars.buyer.lastName = c.buyer.persons[0].lastName;
      msgVars.cart = c;

      let params = c.seller.user.mailRecipients();

      params.mergeLanguage = 'handlebars';
      params.subject = 'Rappel : Facture ' + c.computedPrice + '€ à régler pour ' + c.buyer.companyName;

      return mail.simple(msgVars, params, 'relance_paiement');
    })
    .then(function() {
      return res.end();
    })
    .catch(function(err) {
      return error.handleError(res, err);
    })
};*/
