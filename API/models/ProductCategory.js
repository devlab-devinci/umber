'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ProductCategory = new Schema({
    name: {
        type: String,
        required: true
    },
    picture: {type: Schema.Types.ObjectId, ref: 'ProductCategoryPicture'},
    products: [{type: Schema.Types.ObjectId, ref: 'Product'}],

});

module.exports = mongoose.model('ProductCategory', ProductCategory);
