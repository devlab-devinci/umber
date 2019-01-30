'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ProductPicture = new Schema({
    img: {
        data: Buffer, contentType: String
    }
});

module.exports = mongoose.model('ProductPicture', ProductPicture);
