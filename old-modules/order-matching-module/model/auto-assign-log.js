/*
The code defines the schema for employee object.
*/
const { bold } = require('chalk');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const chefSchema = new Schema({
    chefId: { type: String },
    selectionStatus: { type: String },
    menuItemMatched: { type: String },
    skillsRating: { type: String },
    message: { type: String }
});

const slotSchema = new Schema({
    start: { type: String },
    end: { type: String },
    name: { type: String },
    day: { type: String }
});

const logsSchema = new Schema({
    menuId: { type: String },
    assign: chefSchema,
    unassign: [chefSchema],
    timeSlot: slotSchema
});

var autoassignlogSchema = new Schema({
    orderId: { type: String },
    menuIds: [logsSchema],
}, { timestamps: true });
module.exports = autoassignlogSchema;
