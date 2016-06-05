/**
 * Created by mark on 28/05/16.
 */

var mongoose = require('mongoose');

var UserdataSchema = new mongoose.Schema({
    employee_name: String,
    user_id: String,
    email: String,
    role: String,
    projects: String,
    business_unit: String,
    functional_unit: String,
    department: String,
    team: String,
    supervisor: String
});

mongoose.model('Userdata', UserdataSchema);