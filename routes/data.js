/**
 * Created by mark on 28/05/16.
 */

var express = require('express');
var router = express.Router();

/* DB setup */
var mongoose = require('mongoose');
var ChronoData = mongoose.model('Chronodata');
var LogonData = mongoose.model('Logondata');
var PsychoData = mongoose.model('Psychodata');

/* GET all chronological data */
router.get('/chronodatas', function (req, res, next) {
    ChronoData.find(function (err, data) {
        if (err) {
            return next(err);
        }
        res.json(data);
    });
});

/* GET all usernames */
router.get('/allusers', function (req, res, next) {
    var query = PsychoData.find({}, {user_id: 1, _id: 0});

    query.exec(function (err, data) {
        if (err) {
            return next(err);
        }
        var output = [];
        for (var i = 0; i < data.length; i++) {
            if(data[i].user_id != "") {
                output.push(data[i].user_id);
            }
        }
        res.json(output);
    });
});

/* GET logon data from a specific username */
router.param('data_logon', function (req, res, next, id) {
    var query = LogonData.find({user_id: id});

    query.exec(function (err, data) {
        if (err) {
            return next(err);
        }
        if (!data) {
            return next(new Error('cannot find data'));
        }
        req.data = data;
        return next();
    });
});

router.get('/userdata/logon/:data_logon', function (req, res) {
    res.json(req.data);
});

/* GET psychometric data from a specific username */
router.param('data_psycho', function (req, res, next, id) {
    var query = PsychoData.find({user_id: id});

    query.exec(function (err, data) {
        if (err) {
            return next(err);
        }
        if (!data) {
            return next(new Error('cannot find data'));
        }
        req.data = data;
        return next();
    });
});

router.get('/userdata/psycho/:data_psycho', function (req, res) {
    res.json(req.data);
});


module.exports = router;
