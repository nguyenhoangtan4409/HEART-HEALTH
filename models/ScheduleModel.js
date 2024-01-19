var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScheduleModel = new Schema({
    nameDoctor: {
        type: String,
    },
    idPatient: {
        type: String,
    },
    namePatient: {
        type: String,
    },
    genderPatient: {
        type: String,
    },
    imgPatient: {
        type: String,
    },
    email: {
        type: String,
    },
    date: {
        type: String
    },
    time: {
        type: String,
    },
    content: {
        type: String,
    },
    status: {
        type: Number
    }
})

module.exports = mongoose.model("ScheduleModel", ScheduleModel)