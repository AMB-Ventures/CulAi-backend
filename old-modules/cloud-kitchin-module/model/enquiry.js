var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var enquirySchema = new Schema({
    Name: {
        type: String,
        unique: false,
        required: false
    },
    enquiryId: {
        type: Number,
        unique: true,
        index: true,
    },
    emailId: {
        type: String,
        unique: true,
        index: true,
    },
    mobileNumber: {
        type: String,
        unique: false,
        index: false,
    },
    brandLogo: {
        type: String,
        unique: false,
        index: false
    },
    uploadFile: {
        type: String,
        unique: false,
        index: false
    },
    status: {
        type: String,
        default: "new",
        lowercase: true,
        unique: false,
        index: false
    },
    brandName: {
        type: String,
        unique: false,
        index: false
    },
    webSite: {
        type: String,
        unique: false,
        index: false
    },
    cr_maroof: {
        type: String,
        unique: false,
        index: false
    },
    designation: {
        type: String,
        unique: false,
        index: false
    },
    city: {
        type: String,
        unique: false,
        index: false
    },
    dishes: [{
        type: String,
        unique: false,
        index: false
    }],
    services: [{
        type: String,
        unique: false,
        index: false
    }],
    WayremServices: [{
        type: String,
        unique: false,
        index: false
    }],
    // description: {
    //     type: String,
    //     unique: false,
    //     index: false
    // },
    city_branches: {
        type: String,
        unique: false,
        index: false
    },
    other: {
        type: String,
        unique: false,
        index: false
    }
}, {
    timestamps: true
});

module.exports = enquirySchema;