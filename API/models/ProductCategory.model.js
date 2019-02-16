'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defined object product
// name, cover, adress,
let ProductCategorySchema = new Schema({
    name: {
        type: String,
        index: true,
        required: true
    },
    type: {
        type: String
    }
});

module.exports = mongoose.model('ProductCategory', ProductCategorySchema);
