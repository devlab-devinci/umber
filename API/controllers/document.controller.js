const Document = require('../models/document.model');
const multer = require('multer');
const error = require('../components/errors');
const config = require('../config');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload.path);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({storage: storage}).single('avatar');

// var upload = multer({dest: 'uploads/'});

/* GET home page. */
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
  upload(req, res, (err) => {
    if (err) {
      return res.end('error request file');
    }
    var data = new Document({
      caption: req.caption.originalname
    });
    data.save().then(function (document) {
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
  var id = req.params.id
  Document.findById(id)
    .then(function (data) {
    res.status(200).json(data);
  })
  // else send error
    .catch(function (err) {
      return error.handleError(res, err);
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


/*
const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const error = require('../components/errors');
const config = require('../config');
const uploader = require('../components/uploads');
const Document = require('../models/document.model');

/!* GET home page. *!/
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

exports.create = function(req, res) {
  console.log(req.body);
  if (req.files && req.files.file && req.files.file[0] && req.files.file[0].path) {

    let file = req.files.file[0];

    uploader.renameFile(file.path, path.join(config.upload.dir, file.originalFilename))
      .then(function (filename) {
        req.body.path = config.upload.path + '/' + path.relative(config.upload.dir, filename);
        console.log(filename);
        req.cleanup();

        Document.create(req.body)
          .then(function(data) {
            console.log(data);
            res.status(201).json(data);
          })
          .catch(function (err) {
            return error.handleError(res, err);
          });
      })
      .catch(function (err) {
        return error.handleError(res, err);
      })
  }
  else {
    throw error.generateError({
      code: 404,
      message: 'ERROR_NOT_FOUND'
    });
  }
};

exports.show = function (req, res) {
  var id = req.params.id
  Document.findById(id)
    .then(function (data) {
      res.status(200).json(data);
    })
    // else send error
    .catch(function (err) {
      return error.handleError(res, err);
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
};*/
