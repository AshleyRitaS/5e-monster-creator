var express = require('express'),
    router  = express.Router(),
    morgan  = require('morgan');

router.get('/', function(req, res) {
    res.send('routing.js');
})

router.get('/statblock', function(req, res) {
    res.render('statblock.html');
})

module.exports = router;