var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    categoryName: {
        type: String,
        unique: false,
        required: false
    },
    subCategoryName: {
        type: String,
        unique: false,
        required: false
    },
    subCategoryId: {
        type: Number,
        unique: true,
        index: true,
    },
    description: {
        type: String,
        unique: false,
        index: false
    },
    publish: {
        type: Boolean,
        unique: false,
        index: false
    },
}, {
    timestamps: true
});

module.exports = CategorySchema;