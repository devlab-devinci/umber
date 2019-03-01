'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const StoreLikeModel = new Schema({
    store:
        {
            type: Schema.Types.ObjectId,
            ref: 'Store',
            required: true
        }
    ,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('StoreLike', StoreLikeModel);
