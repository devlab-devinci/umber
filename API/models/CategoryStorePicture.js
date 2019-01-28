'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const StorePicture = new Schema({
    img: {
        data: Buffer, contentType: String
    }
});

module.exports = mongoose.model('Store', StorePicture);
