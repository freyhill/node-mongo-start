var express = require('express');
var app = express();
 
var express = require('express');

module.exports = function (app) {
  app.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
  });
  //app.use('/signup', require('./signup'));
};