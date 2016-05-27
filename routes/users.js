/* Contains all functionality associated with users, including the authentication */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

/* Loading user */
router.param('user', function (req, res, next, id) {
    var query = User.findById(id);

    query.exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error('cannot find user'));
        }
        req.user = user;
        return next();
    });
});

router.get('/users/:id', function (req, res) {
    res.json(user);
});

// router.put('/

module.exports = router;
