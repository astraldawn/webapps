/**
 * Created by mark on 28/05/16.
 */

var mongoose = require('mongoose');

var FiledataSchema = new mongoose.Schema({
    event_id: String,
    user_id: String,
    date: Date,
    pc: String,
    activity: String,
    filename: String,
    to_removable_media: Boolean,
    from_removable_media: Boolean,
    content: String
});

mongoose.model('Filedata', FiledataSchema);