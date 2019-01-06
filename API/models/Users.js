'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema

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
