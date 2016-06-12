/**
 * Created by mark on 21/05/16.
 */

var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    body: String,
    author: String,
    upvotes: {type: Number, default: 0},
    time: Date,
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

CommentSchema.methods.upvote = function (cb) {
    this.upvotes += 1;
    this.save(cb);
};

mongoose.model('Comment', CommentSchema);