/**
 * Created by mark on 28/05/16.
 */

var express = require('express');
var router = express.Router();

/* DB setup */
var mongoose = require('mongoose');
var ChronoData = mongoose.model('Chronodata');
var LogonData = mongoose.model('Logondata');
var UserData = mongoose.model('Userdata');
var DeviceData = mongoose.model('Devicedata');
var FileData = mongoose.model('Filedata');

var datalimit = 500;

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
    var query = UserData.find({}, {user_id: 1, _id: 0});

    query.exec(function (err, data) {
        if (err) {
            return next(err);
        }
        var output = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].user_id !== "") {
                output.push(data[i].user_id);
            }
        }
        res.json(output);
    });
});

/* GET all department names */
router.get('/alldept', function (req, res, next) {
    var query = UserData.distinct("department");

    query.exec(function (err, data) {
        if (err) {
            return next(err);
        }
        var output = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i] !== "") {
                output.push(data[i]);
            }
        }
        output.sort();
        res.json(output);
    });
});

/* GET all department names */
router.get('/allrole', function (req, res, next) {
    var query = UserData.distinct("role");

    query.exec(function (err, data) {
        if (err) {
            return next(err);
        }
        var output = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i] !== "") {
                output.push(data[i]);
            }
        }
        output.sort();
        res.json(output);
    });
});


/* GET logon data from a specific username */
router.param('data_logon', function (req, res, next, id) {
    var query = LogonData.find({user_id: id}).limit(datalimit);

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

/* GET user data from a specific username */
router.param('data_user', function (req, res, next, id) {
    var query = UserData.find({user_id: id});

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

router.get('/userdata/user/:data_user', function (req, res) {
    res.json(req.data);
});

/* GET device data from a specific username */
router.param('data_device', function (req, res, next, id) {
    var query = DeviceData.find({user_id: id}).limit(datalimit);

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

router.get('/userdata/device/:data_device', function (req, res) {
    res.json(req.data);
});


/* GET file data from a specific username */
router.param('data_file', function (req, res, next, id) {
    var query = FileData.find({user_id: id}).limit(datalimit);

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

router.get('/userdata/file/:data_file', function (req, res) {
    res.json(req.data);
});


module.exports = router;