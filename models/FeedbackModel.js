var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackModel = new Schema({
    username: {
        type: String,
        ref: "UserModel"
    },
    name: {
        type: String,
        ref: "UserModel"
    },
    time: {
        type: String,
    },
    content: {
        type: String,
    },
    UrlImg: {
        type: String,
    }
})

module.exports = mongoose.model("FeedbackModel", FeedbackModel)