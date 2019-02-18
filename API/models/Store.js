'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Store = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    pictures: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Document'
        }
    ],
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    categories_store: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Taxonomies',
            required: true
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //set by mapquest api
    mapQuestMapPictureUrl: {type: String},
    mapQuestLat: {type: String},
    mapQuestLng: {type: String},

    created_at: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Store', Store);
