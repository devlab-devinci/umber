'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let CmdHistoriqueSchema = new Schema({
    status: {
        type: String,
        enum: ['prepare', 'ready'],
        default: 'ready'
    },
    ready_at: { // fill  when the command is noticed as ready by the vendor
        type:Date,
        required: true
    },
    identifier: {
      type:String,
      required:true
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    buyer_quick_access:{
        type: Schema.Types.ObjectId,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount_cart: { // ceci est le panier entier ne prenant pas en compte le spread des produtis en fonction des entreprises
        type: Number,
        required: true
    },
    email_facturation: {
        type: String,
        required: true
    },
    card_brand: {type: String, required: true},
    currency: {
        type: String,
        required: true
    },
    reference: { //uuid4
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    stripe_customer: {
        type: String,
        required: true
    },
    stripe_fingerprint: {
        type: String,
        required: true
    },
    balance_transaction: {
        type: String,
        required: true
    },
    exp_month: {
        type: String,
        required: true
    },
    exp_year: {
        type: String,
        required: true
    },
    last4: {
        type: String
    },
    refund_url: {
        type: String,
        required: true
    },
    qr_code: {
        type: String
    }
});


module.exports = mongoose.model('CmdHistorique', CmdHistoriqueSchema);
