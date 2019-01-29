'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const CategoryStorePicture = new Schema({
    img: {
        data: Buffer, contentType: String
    }
});

module.exports = mongoose.model('CategoryStorePicture', CategoryStorePicture);
