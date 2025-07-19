/*
The code defines the schema for employee object.
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var inquirySchema = new Schema({
    kitchenName: {
        type: String,
        unique: false,
        index: false
    },
    kitchenLogo: {
        type: String,
        unique: false,
        index: false
    },
    address: {
        type: String,
        unique: false,
        index: false
    },
    city: {
        type: String,
        unique: false,
        index: false
    }, 
    country: {
        type: String,
        unique: false,
        index: false
    },
    state: {
        type: String,
        unique: false,
        index: false
    },
    inquiryId: {
        type: Number,
        unique: true,
        index: true
    },
    phoneNumber: {
        type: String,
        unique: false,
        index: false
    },
    emailId: {
        type: String,
        unique: true,
        index: true
    },
    status: {
        type: String,
        unique: false,
        index: false
    }
}, {
    timestamps: true
});

module.exports = inquirySchema;