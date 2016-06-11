/**
 * Created by mark on 27/05/16.
 */
var express = require('express');
var router = express.Router();

/* DB setup */
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

// SECRET should be an environment variable (#envvar), same as models/Users.js
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET all posts */
router.get('/', function (req, res, next) {
    Post.find(function (err, posts) {
        if (err) {
            return next(err);
        }
        res.json(posts);
    });
});

/* Creating posts */
router.post('/', auth, function (req, res, next) {

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

router.get('/:post', function (req, res) {
    req.post.populate('comments', function (err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});

/* Delete post */
router.delete('/:post', function (req, res) {
    req.post.remove();
    res.json(null);
});

/* Upvote a post */
router.put('/:post/upvote', auth, function (req, res, next) {
    req.post.upvote(function (err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});

/* Comments for a post */
router.post('/:post/comments', auth, function (req, res, next) {
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
router.put('/:post/comments/:comment/upvote', auth, function (req, res, next) {
    req.comment.upvote(function (err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
});

/* Delete comment */
router.delete('/:post/comments/:comment', function (req, res, next) {
    req.comment.remove();
    res.json(null);
});

module.exports = router;