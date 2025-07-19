var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ShiftSchema = new Schema({
    shift: {
        type: String,
        unique: false,
        required: false
    },
    shiftType: {
        type: String,
        enum: ['employee', 'kitchen'],
        default: 'employee'
    },
    kitchenId: {
        type: Number,
        required: true,
        index: true
    },
    startTime: {
        type: String,
        unique: false,
        index: false,
    },
    endTime: {
        type: String,
        unique: false,
        index: false
    },
    slot: {
        type: Boolean,
        unique: false,
        index: false
    },

}, {
    timestamps: true
});

module.exports = ShiftSchema;