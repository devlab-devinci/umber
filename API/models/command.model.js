'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let CommandSchema = new Schema({
    status: {
        type: String,
        enum: ['paid_active', 'paid_finish' ],
        default: 'active'
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    vendor: [ // les produits peuvent provenir de divers vendeurs du coup penser à mettre tous les vendeur dans cet array pour leur envoyé à chacun un QR code
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    email_facturation: {
        type: String,
        required: true
    },
    card_type: {type: String, required: true},
    currency: {
        type: String,
        required: true
    },
    reference: { //uuid4
        type: String,
        required: true
    }
});


module.exports = mongoose.model('CommandSchema', CommandSchema);
