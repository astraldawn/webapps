var express = require('express');
var router = express.Router();

/* DB setup */
var mongoose = require('mongoose');
var PwnedData = mongoose.model('Pwneddata');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET all pwned data */
router.get('/pwneddatas', function (req, res, next) {
    PwnedData.find(function (err, data) {
        if (err) {
            return next(err);
        }
        res.json(data);
    });
});

module.exports = router;
