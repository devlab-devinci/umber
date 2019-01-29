//TODO
'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Product = new Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', Product);
