'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const CategoryStoreSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    stores: [{type: Schema.Types.ObjectId, ref: 'Store'}],
    picture: {type: Schema.Types.ObjectId, ref: 'CategoryStorePicture'}
});

module.exports = mongoose.model('CategoryStore', CategoryStoreSchema);
