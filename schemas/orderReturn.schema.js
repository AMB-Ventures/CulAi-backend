/*
The code defines the schema for order details object.
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var orderReturnSchema = new Schema({
    returnId: {
        type: Number,
        unique: true,
        index: true,
    },
    returnOrderId: {
        type: Number,
    },
    itemId: {
        type: String
    },  
    returnAddOns:{type:Array},
    returnReason:{type: String},
    isReturnItems:{type:Boolean,default: false},
}, {
    timestamps: true
});

module.exports = orderReturnSchema;