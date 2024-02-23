var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var mongoose = require("mongoose")
var logger = require('morgan');

require('dotenv').config();

const mongoDB = "mongodb://127.0.0.1:27017/projectdb";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
