var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

// TODO: Route for current user.

/* GET current user. */
router.get('/profile', function(req, res) {
  user = currentUser();
	if (user) {
	  res.send(user);
	} else {
	  res.sendStatus(404);
	}
});

module.exports = router;
