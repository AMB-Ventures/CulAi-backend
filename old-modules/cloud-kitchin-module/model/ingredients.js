var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var IngredientsSchema = new Schema({
    ingredients: [{
        type: String,
        unique: true,
        required: false
    }]
}, {
    timestamps: true
});

module.exports = IngredientsSchema;