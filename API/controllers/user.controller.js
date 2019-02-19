'use strict';

const _ = require('lodash');
const jwt = require('jsonwebtoken');

const User = require('../models/Users');
const error = require('../components/errors');
const config = require('../config');


// ADD controller for route index (show list products)
exports.index = function (req, res) {

  let promise = [];
  let limit = req.query && req.query.limit || 0;
  let page = req.query && req.query.page || 0;
  let criteria = {};
  let categories = {};

  if (req.query.userTypes) {
    criteria.userTypes = req.query.userTypes;
  }

  if (req.query.categories) {
    categories = {'shop.categories': req.query.categories};
  }

// add promise find product
  promise.push(User
    .find(categories)
    .populate('imageShop shop.categories')
    .lean());

// when promises resolve
  Promise.all(promise)
  //if not errors send json data
    .then(function (data) {
      let result = {};
      result.data = data[0];
      result.limit = parseInt(limit);
      result.page = parseInt(page);
      result.count = data[0].length;

      res.status(200).json(result);
    })
    // else send error
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

// ADD controller show one product id
exports.show = function (req, res) {
  // Promise find product id db
  User.findById(req.params.id)
  // join owner with model defined in the model Product
    .populate('imageShop')
    //if not errors send json data
    .then(function (data) {
      res.status(200).json(data);
    })
    // else send error
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

/**
 * @api {put} /users/:id Update Single User
 */
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  if (req.user.role !== 'admin') {
    delete req.body.role;
    delete req.body.active;
  }

  User.findById(req.params.id)
    .then(function (user) {
      if (!user) {
        throw error.generateError({
          code: 404,
          message: 'ERROR_USER_NOT_FOUND'
        });
      }
      if (req.user.role !== 'admin' && user._id.toString() !== req.user._id.toString()) {
        throw error.generateError({
          code: 403,
          message: 'ERROR_FORBIDDEN'
        });
      }

      var updated = _.extend(user, req.body);

      return updated.save();
    })
    .then(function (user) {
      return res.status(200).json(user);
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

/**
 * Change a users password
 * req.body.id à ne prendre en compte seulement si le role === 'admin
 * ' sinon req.user._id (pour que seul un admin puisse modifer les mots de passes)
 *
 */
exports.changePassword = function (req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  if (req.body.id) {
    if (req.user.role === 'admin') {
      userId = req.body.id;
    }
    else {
      var err = error.generateError({
        code: 403,
        message: 'ERROR_USER_UNAUTHORIZED'
      });
      return error.handleError(res, err);
    }
  }

  User
    .findById(userId, '+hashedPassword +salt')
    .then(function (user) {
      if (req.user.role === 'admin') {
        user.password = newPass;
        return user.save();
      }
      else if (user.provider.indexOf('local') === -1) {
        user.provider.push('local');
        user.password = newPass;

        return user.save();
      }
      else {
        if (user.authenticate(oldPass)) {
          user.password = newPass;
          return user.save();
        }
        else {
          var err = error.generateError({
            code: 403,
            message: 'ERROR_USER_UNAUTHORIZED'
          });
          throw err;
        }
      }
    })
    .then(function () {
      res.status(200).send('OK');
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

exports.lostPassword = function (req, res) {
  var err;
  var newPass;

  if (!req.body.email) {
    err = error.generateError({
      code: 400,
      message: 'ERROR_NO_EMAIL_PROVIDED'
    });
    return error.handleError(res, err);
  }

  User.findOne({email: req.body.email})
    .then(function (user) {
      if (!user) {
        err = error.generateError({
          code: 404,
          message: 'ERROR_USER_NOT_FOUND'
        });
        throw err;
      }

      user.generatePassword();
      newPass = user.password;

      return user.save();
    })
    /*.then(function (user) {
      var msgVars = {};

      msgVars.user = user;
      msgVars.user.newPass = newPass;
      let params = {};
      params.mergeLanguage = 'handlebars';
      params.subject = 'Votre nouveau mot de passe';
      params.recipient = { email: req.body.email };

      return mail.inline(msgVars, params, 'lost.password.tmpl');
    })*/
    .then(function () {
      return res.end();
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

exports.resetPassword = function (req, res) {
  var err;

  if (!req.body.token) {
    err = error.generateError({
      code: 400,
      message: 'ERROR_NO_TOKEN_PROVIDED'
    });
    return error.handleError(res, err);
  }
  if (!req.body.password) {
    err = error.generateError({
      code: 400,
      message: 'ERROR_NO_PASSWORD_PROVIDED'
    });
    return error.handleError(res, err);
  }

  jwt.verify(req.body.token, config.secrets.session, function (err, decoded) {
    if (err) {
      return error.handleError(res, err);
    }
    if (decoded.type !== 'resetPassword') {
      return error.handleError(res, error.generateError({
        code: 400,
        message: 'ERROR_INVALID_TOKEN_TYPE'
      }));
    }
    User
      .findById(decoded._id, '+resetToken')
      .then(function (user) {
        if (!user) {
          err = error.generateError({
            code: 400,
            message: 'ERROR_USER_NOT_FOUND'
          });
          throw err;
        }
        if (user.resetToken !== req.body.token) {
          err = error.generateError({
            code: 400,
            message: 'ERROR_INVALID_TOKEN_PROVIDED'
          });
          throw err;
        }

        user.resetToken = null;
        user.password = req.body.password;

        return user.save();
      })
      .then(function (user) {
        return res.status(200).send('OK');
      })
      .catch(function (err) {
        return error.handleError(res, err);
      });
  });
};

exports.verifyToken = function (req, res) {
  var err;

  if (!req.body.token) {
    err = error.generateError({
      code: 400,
      message: 'ERROR_NO_TOKEN_PROVIDED'
    });
    return error.handleError(res, err);
  }

  jwt.verify(req.body.token, config.secrets.session, function (err, decoded) {
    if (err) {
      console.error(err);
      return error.handleError(res, error.generateError({
        code: 400,
        message: 'ERROR_TOKEN_' + err.name.toUpperCase()
      }));
    }
    if (decoded.type !== 'resetPassword') {
      return error.handleError(res, error.generateError({
        code: 400,
        message: 'ERROR_INVALID_TOKEN_TYPE'
      }));
    }
    return User.findById(decoded._id).select('+resetToken').lean()
      .then(function (user) {
        if (!user) {
          return error.handleError(res, error.generateError({
            code: 404,
            message: 'ERROR_USER_NOT_FOUND'
          }));
        }
        if (user.resetToken !== req.body.token) {
          return error.handleError(res, error.generateError({
            code: 400,
            message: 'ERROR_INVALID_TOKEN_PROVIDED'
          }));
        }

        return res.status(200).end();
      });
  });
};

/**
 * Get my info
 */
exports.me = function (req, res, next) {
  let userId = req.user._id;
  let promises = [];
  promises.push(User.findById(userId).populate('avatar').lean());

  Promise.all(promises)
    .then(function (result) { // don't ever give out the password or salt
      let user = result[0];
      let unreadCount = result[1];
      if (!user) {
        var err = error.generateError({
          code: 401,
          message: 'ERROR_USER_UNAUTHORIZED'
        });
        throw err;
      }
      user.unreadNotifications = unreadCount;
      res.json(user);
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

exports.register = function (req, res) {
  var err;

  if (!req.body.email) {
    err = error.generateError({
      code: 400,
      message: 'ERROR_NO_EMAIL_PROVIDED'
    });
  }

  if (!req.body.firstName) {
    err = error.generateError({
      code: 400,
      message: 'ERROR_NO_FIRSTNAME_PROVIDED'
    });
  }

  if (!req.body.lastName) {
    err = error.generateError({
      code: 400,
      message: 'ERROR_NO_LASTNAME_PROVIDED'
    });
  }

  if (err) {
    return error.handleError(res, err);
  }

  Promise.all([
    User.findOne({email: req.body.email}, '_id').lean()
  ])
    .then(function (res) {
      let user = res[1];

      if (user) {
        throw error.generateError({
          code: 400,
          message: 'ERROR_EMAIL_ALREADY_REGISTERED'
        });
      }

      let newUser = new User(req.body);
      newUser.generatePassword();

      return newUser.save();
    })
    .then(function () {
      return res.status(201).send('OK');
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};

exports.destroy = function (req, res) {
  User.findById(req.params.id)
    .then(function (user) {
      if (!user) {
        throw error.generateError({
          code: 404,
          message: 'ERROR_USER_NOT_FOUND'
        });
      }
      if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
        throw error.generateError({
          code: 403,
          message: 'ERROR_FORBIDDEN'
        });
      }
      return user.remove();
    })
    .then(function () {
      return res.status(204).send('No Content');
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};
