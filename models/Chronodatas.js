/**
 * Created by mark on 26/05/16.
 */

var mongoose = require('mongoose');

var ChronodataSchema = new mongoose.Schema({
    Title: String,
    Name: String,
    Domain: String,
    BreachDate: Date,
    AddedDate: Date,
    PwnCount: Number,
    Description: String,
    DataClasses: [String],
    IsVerified: Boolean,
    IsSensitive: Boolean,
    IsActive: Boolean,
    IsRetired: Boolean,
    LogoType: String
});

mongoose.model('Chronodata', ChronodataSchema);