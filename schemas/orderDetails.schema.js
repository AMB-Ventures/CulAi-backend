/*
The code defines the schema for order object.
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var orderDetailsSchema = new Schema({
	itemId: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    orderId: {
        type: Number,
        unique: false,
        index: false,
    },
    kitchenId: {
        type: Number,
        unique: false,
        index: false
    },
    chefId: {
        type: Number,
        unique: false,
        index: false
    },
    itemStatus: {
        type: String,
        unique: false,
        index: false
    },
    count: {
        type: Number,
        unique: false,
        index: false
    },
    price: {
        type: Number,
        unique: false,
        index: false
    },    
    cookingInstruction: {
        type: String,
        unique: false,
        index: false
    },
    size: {
        type: String,
        unique: false,
        index: false
    },
    preparationTime: {
        type: Number,
        unique: false,
        index: false
    },
    menuImage: {
        type: String,
        unique: false,
        index: false
    },
    menuId: {
        type: Number,
        unique: false,
        index: false
    }, menuName: {
        type: String,
        unique: false,
        index: false
    },
    rejectedReason : { type: String},
    chefId : { type: Number},
    chefName : { type: String},
    completedTime: {
        type: Number,
        unique: false,
        index: false,
    },
    description: {
        type: String,
        default: null,
        unique: false,
        index: false,
    },
      rejectedByQa: {
        type: Boolean,
        default: false,
        unique: false,
        index: false,
    },
    addOns:{type:Array},
    isItemReturn:{type:Boolean,default: false}
}, {
    timestamps: true
});

module.exports = orderDetailsSchema;