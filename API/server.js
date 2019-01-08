const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const document = require('./routes/documents');
const product = require('./routes/products');
const taxonomy = require('./routes/taxonomies');
const upload = require('./routes/uploads');
const authRouter = require('./routes/authentication');

const app = express();

/**
 * Connect mongodb with mongoose.
 */

//default DEV
mongoose.connect(`mongodb://${config.server.mongo.hostname}/${config.server.mongo.name}`, config.server.mongo.options).then(
  (res) => {
    console.log("Connected to Database Successfully.")
  }
).catch((err) => {
  console.error(err);
  console.log("Conntection to database failed.");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', product);
app.use('/taxonomies', taxonomy);
app.use('/documents', document);
app.use('/upload', upload);
app.use('/auth', authRouter);

app.use(function(err, req, res, next) {

  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);

  res.render('error');
// error handler
  next(createError(404));
});

if (config.seedDB) {
  console.log('To seed');
  require('./seed');
}

module.exports = app;
