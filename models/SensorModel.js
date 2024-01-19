var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SensorModel = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "UserModel"
    },
    idDevice: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        ref: "UserModel"
    },
    sp02: {
        type: Number,
        required: true
    },
    heartbeat: {
        type: Number,
        required: true
    },
    timing: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("SensorModel", SensorModel)