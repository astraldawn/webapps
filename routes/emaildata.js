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
                query.select("user_id email department");
                query.exec(cb);
            },
            departments: function (cb) {
                var query = UserData.distinct("department");
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
                            {
                                $match: {
                                    user_id: obj.user_id
                                    // date: {$gte: start, $lt: end}
                                }
                            },
                            {
                                $group: {_id: "$from", count: {$sum: 1}}
                            }],
                        function (err, res) {
                            var output = res.map(function (item) {
                                if (item.count > 100) {
                                    return {target: obj.user_id, source: item._id, value: item.count};
                                }
                            });
                            callback(null, output);
                        }
                    );
                };
                // callback(null, obj.user_id);
            }

            var len = result.findUsers.length;
            // len = 10;

            for (var i = 0; i < len; i++) {
                var aggregate_func = makeAggregateFunc(result.findUsers[i]);
                aggregatefuncs.push(aggregate_func);
            }

            var emailMap = {};
            for (i = 0; i < result.allUsers.length; i++) {
                var email = result.allUsers[i].email;
                emailMap[email] = {};
                emailMap[email]["user_id"] = result.allUsers[i].user_id;
                emailMap[email]["department"] = result.allUsers[i].department;
            }

            var departmentMap = {};
            var external = result.departments.length;
            for (i = 0; i < result.departments.length; i++) {
                var department = result.departments[i];
                departmentMap[department] = i;
            }

            async.parallel(
                aggregatefuncs,
                function (err, results) {
                    var merged = [].concat.apply([], results);
                    var query_dept = departmentMap[id];
                    var output = [];
                    for (i = 0; i < merged.length; i++) {
                        if (merged[i] != undefined) {
                            var cur = merged[i].source;
                            var output_tmp = {};
                            output_tmp["target"] = merged[i].target;
                            output_tmp["source"] = cur;
                            output_tmp["value"] = merged[i].value;
                            if (emailMap[cur] !== undefined) {
                                var cur_id = emailMap[cur]["user_id"];
                                var cur_dept = emailMap[cur]["department"];
                                output_tmp["source"] = cur_id;
                                output_tmp["sd"] = departmentMap[cur_dept];
                            } else {
                                output_tmp["sd"] = external;
                            }
                            output_tmp["td"] = query_dept;
                            output.push(output_tmp);
                        }
                    }
                    res.json(output);
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