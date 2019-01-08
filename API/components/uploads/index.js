'use strict';

const config = require('../../config');
const multer = require('multer');
const path   = require('path');

/** Storage Engine */
const storageEngine = multer.diskStorage({
  destination: function(req, file, res) {
    res(null, config.upload.path)
  },
  filename: function(req, file, res){
    res(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload =  multer({
  storage: storageEngine,
  limits: { fileSize:200000 },
  fileFilter: function(req, file, res){
    validateFile(file, res);
  }
});

let validateFile = function(file, res){
  let allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType  = allowedFileTypes.test(file.mimetype);
  if(extension && mimeType){
    return res(null, true);
  }else{
    res("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
  }
};

module.exports = upload;