'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const StorePicture = new Schema({
    name: {
        type: String,
        required: true
    }
    //TODO store base64
});

module.exports = mongoose.model('Store', StorePicture);
