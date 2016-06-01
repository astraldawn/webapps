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

/* GET email data from a specific department */
router.param('department', function (req, res, next, id) {
    async.parallel({
            findUsers: function (cb) {
                var query = UserData.find({department: id}, {_id: 0});
                query.select("user_id");
                query.exec(cb);
            },
            allUsers: function (cb) {
                var query = UserData.find({}, {_id: 0});
                query.select("user_id email");
                query.exec(cb);
            }

        }, function (err, result) {
            var aggregatefuncs = [];

            function makeAggregateFunc(obj) {
                return function (callback) {
                    // var aggregate_query =
                    // EmailData.aggregate().match({to: obj.user_id}).group({_id: '$from', count: {$sum: 1}});

                    var start = new Date("2010-01-01T00:00:00.0Z");
                    var end = new Date("2010-01-02T00:00:00.0Z");
                    EmailData.aggregate([
                            {$match: {
                                user: obj.user_id
                                // date: {$gte: start, $lt: end}
                            }},
                            {
                                $group: {_id: "$from", count: {$sum: 1}}
                            }],
                        function (err, res) {
                            var output = res.map(function (item) {
                                return {to: obj.user_id, from: item._id, count: item.count};
                            });
                            callback(null, output);
                        }
                    );
                };
                // callback(null, obj.user_id);
            }

            var len = result.findUsers.length;
            len = 10;

            for (var i = 0; i < len; i++) {
                var aggregate_func = makeAggregateFunc(result.findUsers[i]);
                aggregatefuncs.push(aggregate_func);
            }

            var emailMap = {};
            for (i = 0; i < result.allUsers.length; i++) {
                var email = result.allUsers[i].email;
                emailMap[email] = result.allUsers[i].user_id;
            }

            async.parallel(
                aggregatefuncs,
                function (err, results) {
                    var merged = [].concat.apply([], results);
                    for (i = 0; i < merged.length; i++) {
                        var cur = merged[i].from;
                        if (emailMap[cur] !== undefined) {
                            merged[i]["from"] = emailMap[cur];
                        }
                    }
                    res.json(merged);
                }
            );
        }
    );
// };

// process();
})
;

router.get('/:department', function (req, res) {
    res.json(req.data);
});


module.exports = router;