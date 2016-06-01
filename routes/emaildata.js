/**
 * Created by mark on 28/05/16.
 */

var express = require('express');
var router = express.Router();

/* DB setup */
var mongoose = require('mongoose');
var UserData = mongoose.model('Userdata');
var EmailData = mongoose.model('Emaildata');

/* GET email data from a specific department */
router.param('department', function (req, res, next, id) {
    var query = UserData.find({department: id}, {_id: 0});
    query.select("user_id");

    query.exec().then(
        function (users) {
            var tmp = users.map(function (user) {
                return user.user_id;
            });
            res.json(tmp);
        }
    )
});

router.get('/:department', function (req, res) {
    res.json(req.data);
});


module.exports = router;