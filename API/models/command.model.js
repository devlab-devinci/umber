'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Quand un panier est validé puis payé, la logique est la suivate:
 *  -> si pas d'erreur on remove le currentCart (db + local)
 *  -> regrouper chaque articles du panier en fonction de l'entreprise owner
 *  -> creer une commande pour chaque entreprises et génère son QR code
 */

let CommandSchema = new Schema({
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
        type:String,
        required:true
    },
    balance_transaction: {
        type:String,
        required:true
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
        type:String
    },
    refund_url : {
        type:String,
        required:true
    },
    qr_code: {
        type: String
    }
});


module.exports = mongoose.model('Command', CommandSchema);
