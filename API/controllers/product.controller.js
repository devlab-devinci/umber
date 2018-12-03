const Product = require('../models/product.model');
const error = require('../components/errors');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.send('Greetings from the Test controller!');
  let promise = []
  promise.push(Product.find().then(function (data) {
    console.log(data);
  })
    .catch()(function (err) {
      console.log(err);
    }));
  Promise.all(promise)
    .then(function (data) {
      let result = {};
      result.total = data[0];
      result.limit = parseInt(limit);
      result.page = parseInt(page);
      result.count = data[1].length;
      result.options = data[1];

      res.status(200).json(result);
    })
    .catch(function (err) {
      return error.handleError(res, err);
    });
};