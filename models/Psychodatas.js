/**
 * Created by mark on 28/05/16.
 */

var mongoose = require('mongoose');

var PsychodataSchema = new mongoose.Schema({
    employee_name: String,
    user_id: String,
    openness: Number,
    conscience: Number,
    extrav: Number,
    agree: Number,
    neuro: Number
});

mongoose.model('Psychodata', PsychodataSchema);