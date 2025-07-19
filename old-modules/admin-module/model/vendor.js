var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var vendorSchema = new Schema({
    vendorName: {
        type: String,
        unique: false,
        required: false
    },
    vendorId: {
        type: Number,
        unique: true,
        index: true,
    },
    vendorLogo: {
        type: String,
        unique: false,
        index: false
    },
    licenseKey: {
        type: String,
        unique: false,
        index: false
    },
    webHookUrl: {
        type: String,
        unique: false,
        index: false
    },
    publish: {
        type: Boolean,
        unique: false,
        index: false
    }
}, {
    timestamps: true
});

module.exports = vendorSchema;