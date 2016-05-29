var express = require('express');
var router = express.Router();

/* Load required modules */
var passport = require('passport');
var jwt = require('express-jwt');
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* Registration */
router.post('/register', function (req, res, next) {
    /* Some error checking.*/
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    if (req.body.username.length < 4 || req.body.username.length > 20) {
      return res.status(400).json({message: 'Username must ' + 
          'have 4 to 20 characters size'});
    }

    if (req.body.password.length < 4 || req.body.password.length > 20) {
      return res.status(400).json({message: 'Password must ' +
          'have 4 to 20 characters size'});
    }

    var user = new User();
    user.username = req.body.username;
    user.setPassword(req.body.password);

    user.save(function (err) {
        if (err) {
            return next(err);
        }
        return res.json({token: user.generateJWT()});
    });
});

/* Login */
router.post('/login', function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (user) {
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

module.exports = router;
