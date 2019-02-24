'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defined object product
// name, cover, adress,
let ProductSchema = new Schema({
    name: {
        type: String,
        index: true,
        required: true
    },
    cover: {
        type: Schema.Types.ObjectId,
        ref: 'Document'
    },
    categories: [{
        // join categories with Taxo
        type: Schema.Types.ObjectId,
        ref: 'ProductCategory'
    }],
    price: {
        type: Number,
        required: true
    },
    promotion: {
        type: Number
    },
    stock: {
        type: Number,
        required: true
    },
    description: String,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    publishedAt: Date,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store'
    },
    //add for the logical of add item in cart only for one store per one store (means we cant add one product from another store in cart for one store else we replace the current store s)
    store_access_name: {
        type: String
    }
});

ProductSchema.pre('save', function () {
    let that = this;

    that.wasNew = that.isNew;
    that.updatedAt = new Date();
});

// create model in the mongodb
module.exports = mongoose.model('Product', ProductSchema);
