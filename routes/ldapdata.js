/**
 * Created by mark on 28/05/16.
 */

var express = require('express');
var router = express.Router();

/* DB setup */
var mongoose = require('mongoose');
var async = require('async');
var UserData = mongoose.model('Userdata');
var EmailData = mongoose.model('Emaildata');

/*
 Each query has a threshold * 100 % chance of running.

 Params
 - user_id
 - start
 - end
 - min_weight
 - threshold
 */
function aggregateEmail(user_id, min_weight, threshold, start, end) {
    return function (callback) {
        // var aggregate_query =
        // EmailData.aggregate().match({to: obj.user_id}).group({_id: '$from', count: {$sum: 1}});
        // var process = Math.random();
        // if (process < threshold) {
        EmailData.aggregate([
                {
                    $match: {
                        user_id: user_id,
                        date: {$gte: start, $lte: end}
                    }
                },
                {
                    $group: {_id: "$from", count: {$sum: 1}}
                }],
            function (err, res) {
                var output = res.map(function (item) {
                    if (item.count > min_weight) {
                        return {target: user_id, source: item._id, value: item.count};
                    }
                });
                callback(null, output);
            }
        );
    };
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

/* GET email data from a specific role */
router.param('role', function (req, res, next, role) {
    async.parallel({
            findUsers: function (cb) {
                var query = UserData.find({role: role}, {_id: 0});
                query.select("user_id");
                query.exec(cb);
            },
            allUsers: function (cb) {
                var query = UserData.find({}, {_id: 0});
                query.select("user_id email role");
                query.exec(cb);
            },
            roles: function (cb) {
                var query = UserData.distinct("role");
                query.exec(cb);
            },
            startDate: function (cb) {
                var query = EmailData.find({}, {_id: 0});
                query.sort({date: 1}).limit(1).select("date");
                query.exec(cb);
            },
            endDate: function (cb) {
                var query = EmailData.find({}, {_id: 0});
                query.sort({date: -1}).limit(1).select("date");
                query.exec(cb);
            }
        }, function (err, result) {
            req.id = role;
            result.roles.sort();
            req.result = result;
            req.startDate = result.startDate[0].date;
            req.endDate = result.endDate[0].date;
            return next();
        }
    );
});

router.param('startdate', function (req, res, next, startDate) {
    req.startDate = startDate;
    return next();
});

router.param('enddate', function (req, res, next, endDate) {
    req.endDate = endDate;
    return next();
});

router.get('/:role/:startdate/:enddate', function (req, res) {
    var aggregatefuncs = [];

    var result = req.result;
    var id = req.id;
    var startDate = new Date(req.startDate);
    var endDate = new Date(req.endDate);
    var len = result.findUsers.length;

    console.log("role - params", startDate, endDate);

    var day_diff = (endDate - startDate) / (3600 * 24 * 1000);

    // Safety check
    if (day_diff < 1) {
        res.json("Invalid request");
        return;
    }

    var min_weight = 2;
    var threshold = 1;
    var max_users = 20;

    /* Scale possibility of each query running to the input size */
    if (len > max_users) {
        len = max_users;
    }

    result.findUsers = shuffleArray(result.findUsers);

    for (var i = 0; i < len; i++) {
        var c_user = result.findUsers[i].user_id;
        var aggregate_func = aggregateEmail(c_user, min_weight, threshold, startDate, endDate);
        aggregatefuncs.push(aggregate_func);
    }

    var emailMap = {};
    for (i = 0; i < result.allUsers.length; i++) {
        var email = result.allUsers[i].email;
        emailMap[email] = {};
        emailMap[email].user_id = result.allUsers[i].user_id;
        emailMap[email].role = result.allUsers[i].role;
    }

    var roleMap = {};
    var external = result.roles.length;
    for (i = 0; i < result.roles.length; i++) {
        var role = result.roles[i];
        roleMap[role] = i;
    }

    async.parallel(
        aggregatefuncs,
        function (err, results) {
            var merged = [].concat.apply([], results);
            var query_role = roleMap[id];
            var output = [];
            console.log(merged.length);
            for (i = 0; i < merged.length; i++) {
                if (merged[i] !== null && merged[i] !== undefined) {
                    var cur = merged[i].source;
                    var output_tmp = {};
                    output_tmp.target = merged[i].target;
                    output_tmp.source = cur;
                    output_tmp.value = merged[i].value;
                    if (emailMap[cur] !== undefined) {
                        var cur_id = emailMap[cur].user_id;
                        var cur_role = emailMap[cur].role;
                        output_tmp.source = cur_id;
                        output_tmp.sd = roleMap[cur_role];
                    } else {
                        output_tmp.sd = external;
                    }
                    output_tmp.td = query_role;
                    output.push(output_tmp);
                }
            }
            res.json(output);
        }
    );
});

router.get('/:role/getdate', function (req, res) {
    console.log("role - get date");
    var output = {};
    output.startDate = req.startDate;
    output.endDate = req.endDate;
    res.json(output);
});

module.exports = router;