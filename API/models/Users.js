'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
         type: String,
         required: true
        },
        /*
    password: {
        type: String,
        required: true
    },
    */
    companyName: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    userTypes: {
        type: String,
        enum: ['seller', 'buyer'],
        default: 'buyer'
    },
    imageShop: {
        type: Schema.Types.ObjectId,
        ref: 'Document'
    },
    picture: {
        type: String,
        required: true
    },
    createdAt:
    { type: Date },
    updatedAt:
    { type: Date }
});


UserSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});
module.exports = mongoose.model('User', UserSchema);
