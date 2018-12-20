const Document = require('../models/document.model');
const error = require('../components/errors');
const multer = require('multer');
const path   = require('path');
const config = require('../config');

//controller create product
exports.upload = function (req, res) {

  /** Storage Engine */
  const storageEngine = multer.diskStorage({
    destination: config.upload,
    filename: function(req, file, fn){
      fn(null,  new Date().getTime().toString()+'-'+file.fieldname+path.extname(file.originalname));
    }
  });

//init

  const upload =  multer({
    storage: storageEngine,
    limits: { fileSize:200000 },
    fileFilter: function(req, file, callback){
      validateFile(file, callback);
    }
  }).single('photo');


  var validateFile = function(file, cb ){
    allowedFileTypes = /jpeg|jpg|png|gif/;
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType  = allowedFileTypes.test(file.mimetype);
    if(extension && mimeType){
      return cb(null, true);
    }else{
      cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
    }
  }

  if(error){
    res.redirect('/?msg=3');
  }else{
    if(req.file === undefined){

      res.redirect('/?msg=2');

    }else{

      /**
       * Create new record in mongoDB
       */
      var fullPath = "upload/"+req.file.filename;

      var document = {
        path:     fullPath,
        caption:   req.body.caption
      };

      var photo = new Document(document);
      photo.save(function(error){
        if(error){
          throw error;
        }
        res.redirect('/?msg=1');
      });
    }
  }
};