'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ProductCategoryPicture = new Schema({
    img: {
        data: Buffer, contentType: String
    }
});

module.exports = mongoose.model('ProductCategoryPicture', ProductCategoryPicture);
