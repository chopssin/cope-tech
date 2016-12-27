var debug = require('debug')('routes');
var express = require('express');
var router = express.Router();

router.get('*', function(req, res, next) {
  debug('hostname = ' + req.hostname);
  next();
});

// GET home page
router.get('/', function(req, res, next) {
  res.render('mypage', { title: 'Cope' });
});

// GET firebase config
router.get('/cope-config', function(req, res, next) {
  var config = {
    apiKey: "AIzaSyCgOKeDjUkWX5gBni6e2dhBYBH7u8Uks3E",
    authDomain: "cope-326d5.firebaseapp.com",
    databaseURL: "https://cope-326d5.firebaseio.com",
    storageBucket: "cope-326d5.appspot.com",
    messagingSenderId: "201704308584"
  };
  res.send(config);
});

router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Cope - Test page' });
});

module.exports = router;
