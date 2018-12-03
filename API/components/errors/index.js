/**
 * Error responses
 */

'use strict';

module.exports = {
  generateError: function (errObj) {
    var err = new Error();
    err.message = errObj.message;
    err.code = errObj.code;
    err.infos = errObj.infos;

    return err;
  },

  handleError: function (res, err) {
    var code = err.code || 500;
    var message = err.message || 'ERROR_HANDLING_REQUEST';
    if (process.env.NODE_ENV !== 'test') {
      console.error(err);
    }

    return res.status(code).send(message);
  }
};