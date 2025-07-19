var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    userId: {
        type: Number,
        unique: true,
        index: true,
        required: true
    },
    kitchenId: {
        type: Number,
        unique: false,
        index: false,
        required: true
    },
    emailId: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    role: [{type:String}],
    password: {
        type: String,
        unique: false,
        index: false
    },
    name: {
        type: String,
        unique: false,
        index: false
    },
    details: {
        type: String,
        unique: false,
        index: false
    },
    profilePic: {
        type: String,
        unique: false,
        index: false
    },
    lisenceKey: {
        type: String,
        unique: false,
        index: false
    },
    updatedBy: {
        type: String,
        unique: false,
        index: false
    }
}, {
    timestamps: true
});
module.exports = userSchema;