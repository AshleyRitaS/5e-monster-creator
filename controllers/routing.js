var express = require('express'),
    router  = express.Router(),
    morgan  = require('morgan');

router.get('/', function(req, res) {
    res.render('statblock.html');
})

router.get('/statblock', function(req, res) {
    res.render('statblock.html');
})