var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// DB connection
var mongoose = require('mongoose');
require('./models/Posts');
require('./models/Comments');

// Authentication
var passport = require('passport');
require('./models/Users');
require('./config/passport');

// Data
require('./models/Chronodatas');
require('./models/Userdatas');
require('./models/Logondatas');
require('./models/Filedatas');
require('./models/Devicedatas');
require('./models/Emaildatas');

// Connect to DB
mongoose.connect('mongodb://localhost/webapps');

// Establish routes
var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var posts = require('./routes/posts');
var data = require('./routes/data');
var emaildata = require('./routes/emaildata');
var ldapdata = require('./routes/ldapdata');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication
app.use(passport.initialize());

app.use('/', routes);
app.use('/', auth);
app.use('/', data);
app.use('/posts', posts);
app.use('/users', users);
app.use('/emaildata', emaildata);
app.use('/ldapdata', ldapdata);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// var server = app.listen(3000, function(){
//     console.log("Starting server on port 3000");
// });
//
// app.closeServer = function(){
//     server.close();
//     console.log("Closing server");
// };

module.exports = app;