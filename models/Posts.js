/**
 * Created by mark on 21/05/16.
 */

var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title: String,
    author: String,
    graphType: String,
    leftSubCat: String,
    rightSubCat: String,
    leftFrom: Date,
    leftTo: Date,
    rightFrom: Date,
    rightTo: Date,
    upvotes: {type: Number, default: 0},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

PostSchema.methods.upvote = function (cb) {
    this.upvotes += 1;
    this.save(cb);
};

mongoose.model('Post', PostSchema);