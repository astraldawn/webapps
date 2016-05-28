/**
 * Created by mark on 28/05/16.
 */

var mongoose = require('mongoose');

var LogondataSchema = new mongoose.Schema({
    event_id: String,
    user_id: String,
    date: Date,
    pc: String,
    activity: String
});

mongoose.model('Logondata', LogondataSchema);