/**
 * Created by mark on 28/05/16.
 */

var express = require('express');
var router = express.Router();

/* DB setup */
var mongoose = require('mongoose');
var EmailData = mongoose.model('Emaildata');

var datalimit = 500;

/* GET logon data from a specific username */
router.param('department', function (req, res, next, id) {
    // var query = LogonData.find({user_id: id}).limit(datalimit);
    //
    // query.exec(function (err, data) {
    //     if (err) {
    //         return next(err);
    //     }
    //     if (!data) {
    //         return next(new Error('cannot find data'));
    //     }
    //     req.data = data;
    //     return next();
    // });
    return next();
});

router.get('/:department', function (req, res) {
    // res.json(req.data);
    res.json("hello world");
});


module.exports = router;