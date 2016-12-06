var debug = require('debug');
var express = require('express');
var router = express.Router();

router.get('*', function(req, res, next) {
  debug(req.originalUrl);
});

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cope' });
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

module.exports = router;
