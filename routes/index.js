var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* DB setup */
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

// SECRET should be an environment variable (#envvar), same as models/Users.js
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

/* GET all posts */
router.get('/posts', function (req, res, next) {
    Post.find(function (err, posts) {
        if (err) {
            return next(err);
        }
        res.json(posts);
    });
});

/* Creating posts */
router.post('/posts', auth, function (req, res, next) {

    var post = new Post(req.body);
    post.author = req.payload.username;

    post.save(function (err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});

/* Loading post */
router.param('post', function (req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, post) {
        if (err) {
            return next(err);
        }
        if (!post) {
            return next(new Error('cannot find post'));
        }
        req.post = post;
        return next();
    });
});

router.get('/posts/:post', function (req, res) {
    req.post.populate('comments', function (err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});

/* Upvote a post */
router.put('/posts/:post/upvote', auth, function (req, res, next) {
    req.post.upvote(function (err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});


/* Comments for a post */
router.post('/posts/:post/comments', auth, function (req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.author = req.payload.username;

    comment.save(function (err, comment) {
        if (err) {
            return next(err);
        }

        req.post.comments.push(comment);
        req.post.save(function (err, post) {
            if (err) {
                return next(err);
            }
            res.json(comment);
        });
    });
});

/* Loading comment */
router.param('comment', function (req, res, next, id) {
    var query = Comment.findById(id);
    query.exec(function (err, comment) {
        if (err) {
            return next(err);
        }
        if (!comment) {
            return next(new Error('cannot find comment'));
        }
        req.comment = comment;
        return next();
    });
});

/* Upvote comment */
router.put('/posts/:post/comments/:comment/upvote', auth, function (req, res, next) {
    req.comment.upvote(function (err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
});

module.exports = router;
