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
        required: true
    },
    schemaId: {
        type: Number,
        unique: false,
        index: false,
    },
    orderId: {
        type: String,
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
    // qaId: {
    //     type: Number,
    //     unique: false,
    //     index: false
    // },
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
    vendorLogo: {
        type: String,
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
    }

}, {
    timestamps: true
});

module.exports = orderDetailsSchema;