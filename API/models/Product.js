'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Product = new Schema({
    name: {
        type: String,
        required: true
    },
    /*price: {
        type: Schema.Types.Decimal,
        required: true
    },
    */
    stock: {
        type: Number,
        required: true
    },
    pictures: [{
        type: Schema.Types.ObjectId,
        ref: 'ProductPicture'
    }],
    categories_product: [{
        type: Schema.Types.ObjectId,
        ref: 'ProductCategory'
    }],
    stores: [{
        type: Schema.Types.ObjectId,
        ref: 'Store'
    }],
    created_at: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Product', Product);
