var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var csrf = require('csurf');

// Load routes
var index = require('./routes/index');
var users = require('./routes/UserRoutes');
var userAPI = require('./routes/UserAPI');

var app = express();

// Load .env file
require('dotenv').config();

var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash')
var mongoose = require('mongoose');
var configDB = require('./config/database');
var mongoStore = require('connect-mongo')(session);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Database and passport setup
mongoose.Promise = global.Promise; //For hiding the "deprecated" warning
mongoose.connect(configDB.url,function(err, next) {
  if (err) {
    console.error("Faild to load DB");
  } else {
    console.log("Your awesome Database is connected on");
    console.log(configDB.url);
  }
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection Warning: error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection Warning: disconnected');
});

app.use(session({
  secret: 'algeriannewbieStemplate',
  name: 'itismysessions',
  resave: false,
  saveUninitialized: false,
  store: new mongoStore({mongooseConnection: mongoose.connection})
}));

// Passport configuration
require('./config/passport')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// To enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

/*
* Helmet can help protect your app from some well-known web vulnerabilities
* by setting HTTP headers appropriately.
* https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
* */
app.use(helmet());

app.use(csrf());
app.use(function(req, res, next){
 res.locals.csrftoken = req.csrfToken();
 console.log(req.csrfToken());
 next();
});

app.use('/', index);
app.use('/users', users);
app.use('/api/users', userAPI);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
