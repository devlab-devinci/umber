const Document = require('../../models/document.model');
const error = require('../errors');
const multer = require('multer');
const path   = require('path');
const config = require('../../config');
const util = require('util');

function validateFile (file, res){
  let allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType  = allowedFileTypes.test(file.mimetype);
  if(extension && mimeType){
    return res(null, true);
  }else{
    return error.generateError({
      code: 403,
      message: 'Invalid file type. Only JPEG, PNG and GIF file are allowed.'
    });
  }
}

const storageOptions = multer.diskStorage({
  destination: function(req, file, res) {
    res(null, config.upload.path)
  },
  filename: function(req, file, res){
    res(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

let upload =
  multer({
    storage: storageOptions,
    limits: {fileSize: 200000},
    fileFilter: function (req, file, res) {
      validateFile(file, res);
    }
  });

class Uploader {

  async startUpload(req, res) {
    let filename;

    try {

      upload = util.promisify(upload.any());

      await upload(req, res);

      filename = req.files[0].filename;

    } catch (err) {
      err.code = 422;
      return error.handleError(res, err);
    }

    var fullPath = config.upload.path + '/' +req.file.filename;

    var document = {
      path:     fullPath,
      caption:   req.body.caption
    };

    var file = new Document(document);
    file
      .save()
      //if promise not errors send json data
      .then(function () {
        res.status(201);
        res.json({fileUploaded: filename});
      })
      // else send error and not save
      .catch(function (err) {
        err.code = 422;
        return error.handleError(res, err);
      });
  }
}

module.exports = Uploader;