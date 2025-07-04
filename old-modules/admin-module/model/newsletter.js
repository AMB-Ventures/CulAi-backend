var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var newsletterSchema = new Schema({
    description: {
        type: String,
        unique: false,
        index: false
    }
}, { timestamps: true });

module.exports = newsletterSchema;