var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var skillSchema = new Schema({
    skillId: {
        type: Number,
        unique: true,
        index: true,
        required: true
    },
    skills: {
        type: String,
        unique: false,
        index: false
    },
    tag: {
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
module.exports = skillSchema;