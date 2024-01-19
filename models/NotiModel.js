var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotiModel = new Schema({
    username: {
        type: String,
    },
    time: {
        type: String,
    },
    content: {
        type: String,
    }
})

module.exports = mongoose.model("NotiModel", NotiModel)