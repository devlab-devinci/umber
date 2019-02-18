'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const cart = require('./routes/carts');
const document = require('./routes/documents');
const product = require('./routes/products');
const taxonomy = require('./routes/taxonomies');
const upload = require('./routes/uploads');
const authRouter = require('./routes/authentication');
const categoryStore = require('./routes/categoryStore');
const store = require('./routes/store');
const position = require('./routes/position');
const productCategory = require('./routes/productCategory');
const advanced = require('./routes/advanced');
const app = express();

//default DEV
mongoose.connect(`mongodb://${config.server.mongo.hostname}/${config.server.mongo.name}`, config.server.mongo.options).then(
  (res) => {
    console.log("Connected to Database Successfully.")
    console.log('Mongo DB listening on ' + config.server.port);
  }
).catch((err) => {
  console.error(err);
  console.log("Conntection to database failed.");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(errorHandler());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/products', product);
app.use('/api/v1/carts', cart);
app.use('/taxonomies', taxonomy);
app.use('/documents', document);
app.use('/upload', upload);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/api/v1', categoryStore);
app.use('/api/v1', store);
app.use('/api/v1', position);
app.use('/api/v1', productCategory);
app.use('/api/v1', advanced); // dual

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.use(config.uploadExpressPath, express.static(config.uploadDir));

if (config.seedDB) {
  console.log('To seed');
  require('./seed');
}

module.exports = app;
