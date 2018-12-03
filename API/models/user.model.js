'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

var UserSchema = new Schema({
  firstName: {
    type: String,
    index: true
  },
  lastName: {
    type: String,
    index: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  avatar: {
    type: Schema.Types.ObjectId,
    ref: 'Document'
  },
  username: String,
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
  hashedPassword: {
    type: String,
    select: false
  },
  resetToken: {
    type: String,
    select: false
  },
  notify: {
    report: { type: Boolean, default: true }
  },
  provider: [String],
  salt: {
    type: String,
    select: false
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function () {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function () {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function (hashedPassword) {
    // if (this.password) {
    // if (this.password.length < 8) this.invalidate('password', 'ERROR_USER_PASSWORD_LENGTH');
    // if (!this.password.match(/[A-Z]/g)) this.invalidate('password', 'ERROR_USER_PASSWORD_UPPERCASE');
    // if (!this.password.match(/[0-9]/g)) this.invalidate('password', 'ERROR_USER_PASSWORD_DIGIT');
    // if (!this.password.match(/[!@#$€%^&*()_+\-=\[\]{};':"\|,.<>\/?]/g)) this.invalidate('password', 'ERROR_USER_PASSWORD_SPECIAL_CHAR');
    // }

    return hashedPassword.length;
  }, 'Password cannot be blank');

UserSchema
  .path('role')
  .set(function (newVal) {
    this._prevRole = this.role;
    return newVal;
  });

/**
 * Hooks
 */
UserSchema
  .pre('save', function (next) {
    var that = this;
    that.wasNew = that.isNew;
    if (that.wasNew && that.role !== 'admin') {
      that.generatePassword();
      that._newPass = that.password;
      that._register = true;
    }
    that.updatedAt = new Date();
    next();
  });

/*UserSchema
  .post('save', function () {
    var that = this;

    if (that._register) {
      let msgVars = {};

      msgVars.user = that;
      msgVars.user.newPass = that._newPass;

      let params = {};
      params.mergeLanguage = 'handlebars';
      params.subject = 'Bienvenue sur Umber';
      params.recipient = { email: that.email };

      mail.inline(msgVars, params, 'register.tmpl')
        .then(function () {
          console.log(that._id, 'Register mail sent');
        })
        .catch(function (err) {
          console.error(err);
          console.error(that._id, 'Register mail NOT sent');
        });
    }
  });*/
/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   */
  encryptPassword: function (password) {
    if (!password || !this.salt) return '';
    var salt = Buffer.from(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
  },

  /**
   * lost password
   */
  lostPassword: function () {
    return jwt.sign({
      _id: this._id,
      type: 'resetPassword'
    }, config.secrets.session, {
      expiresIn: 60 * 60 * 1 // Valide 1h
    });
  },

  /**
   * generate password
   */
  generatePassword: function () {
    this.password = Math.random().toString(36).slice(-8);
  }
};

module.exports = mongoose.model('User', UserSchema);
