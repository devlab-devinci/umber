const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config.js');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const document = require('./routes/documents');
const product = require('./routes/products');
const taxonomy = require('./routes/taxonomies');
const upload = require('./routes/uploads');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', product);
app.use('/taxonomies', taxonomy);
app.use('/documents', document);
app.use('/upload', upload);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (config.seedDB) {
  console.log('To seed');
  require('./seed');
}

module.exports = app;
