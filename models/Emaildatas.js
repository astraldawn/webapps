/**
 * Created by mark on 28/05/16.
 */

var mongoose = require('mongoose');

var EmaildataSchema = new mongoose.Schema({
    event_id: String,
    user_id: String,
    date: Date,
    pc: String,
    to: String,
    cc: String,
    bcc: String,
    from: String,
    activity: String,
    size: String,
    attachments: String,
    content: String
});

mongoose.model('Emaildata', EmaildataSchema);