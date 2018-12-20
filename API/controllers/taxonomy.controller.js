'use strict';

const Taxonomy = require('../models/taxonomy.model');
const error = require('../components/errors');
const _ = require('lodash');

exports.index = function (req, res) {
  var criteria = {};
  var result = {};
  var limit = req.query.limit || 0;
  var page = req.query.page || 0;
  var skip = 0;
  var promise = [];


  if (req.query.name) {
    var nameRegExp = new RegExp(_.escapeRegExp(req.query.name), 'i');
    criteria.$or = {
      name: nameRegExp
    };
  }

  if (req.query.type) {
    criteria.type = req.query.type;
  }

  if (req.query.skip) skip = req.query.skip;
  else if (req.query.page) skip = req.query.page * limit;
  else skip = 0;

  var sort = 'order';
  if (req.query.sort) {
    sort = (req.query.order ? req.query.order : '') + (req.query.sort);
  }

  promise.push(Taxonomy.count(criteria));
  promise.push(Taxonomy
    .find(criteria)
    .sort(sort)
    .limit(parseInt(limit))
    .skip(skip)
    .lean());

  Promise.all(promise)
    .then(function (data) {
      result.total = data[0];
      result.limit = parseInt(limit);
      result.page = parseInt(page);
      result.count = data[1].length;
      result.data = data[1];
      res.status(200).json(result);
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

exports.show = function (req, res) {
  Taxonomy
    .findById(req.params.id)
    .lean()
    .then(function (taxonomy) {
      if (!taxonomy) {
        throw error.generateError({
          code: 404,
          message: 'Not Found'
        });
      }
      return res.json(taxonomy);
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

exports.create = function (req, res) {
  Taxonomy
    .create(req.body)
    .then(function (taxonomy) {
      return res.status(201).json(taxonomy);
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  Taxonomy
    .findById(req.params.id)
    .then(function (taxonomy) {
      if (!taxonomy) {
        var err = error.generateError({
          code: 404,
          message: 'ERROR_TAXONOMY_NOT_FOUND'
        });
        throw err;
      }
      var updated = _.extend(taxonomy, req.body);
      return updated.save();
    })
    .then(function (taxo) {
      return res.status(200).json(taxo);
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

exports.destroy = function (req, res) {
  Taxonomy
    .findById(req.params.id)
    .then(function (taxonomy) {
      if (!taxonomy) {
        var err = error.generateError({
          code: 404,
          message: 'ERROR_TAXONOMY_NOT_FOUND'
        });
        throw err;
      }
      return taxonomy.remove();
    })
    .then(function () {
      return res.status(204).send('No Content');
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};
