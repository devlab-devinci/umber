'use strict';

const Document = require('../models/document.model');
const error = require('../components/errors');
const config = require('../config');
const upload = require('../components/uploads');

/* GET docs page. */
exports.index = function (req, res) {
  Document.find({})
    .then(function (data) {
      res.status(200).json(data);
    })
    // else send error
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

exports.create = function (req, res) {

  console.log(req);
  upload.any()(req, res, (err) => {
    if (err) {
      return res.end('error request file');
    }

    console.log(req.files || req.file);

    let fullPath = config.upload.path + '/' + req.files[0].filename;

    let newDocument = new Document({
      path: fullPath,
      name: req.files[0].filename,
      originalName: req.files[0].originalname,
      type: req.files[0].mimetype
    });

    console.log(newDocument);

    newDocument
      .save()
      .then(function (document) {
        res.status(201);
        res.json(document);
      })
      // else send error and not save
      .catch(function (err) {
        err.code = 422;
        return error.handleError(res, err);
      });
  });
};

exports.show = function (req, res) {

  let path = process.cwd() + '/upload/' + req.params.name;

  fs.exists(path, (exists) => {
    if (exists) {
      res.status(201);
      res.sendFile(path);
    } else {
      return error.handleError(res, {
        code: 422,
        message: 'ERROR_HANDLING_REQUEST'
      });
    }
  });
};

exports.destroy = function (req, res) {
  Document.remove({_id: req.params.id})
    .then(function (document) {
      if (!document) {
        throw error.generateError({
          code: 404,
          message: 'ERROR_NOT_FOUND'
        });
      }
      return document.remove();
    })
    .then(function () {
      return res.status(204).send('No Content');
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};