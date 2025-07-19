var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var passwordSchema = new Schema({

    emailId: {
        type: String,
        unique: true,
        index: true,
    },
    OTP: {
        type: String,
        unique: false,
        index: false,
    }
}, {
    timestamps: true
});

module.exports = passwordSchema;