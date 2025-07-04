/*
The code defines the schema for order details object.
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var orderSchema = new Schema({
    schemaId: {
        type: Number,
        unique: true,
        index: true,
        required: true
    },
    orderId: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    customerName: {
        type: String,
        unique: false,
        index: false
    },
    customerMobileNumber: {
        type: String,
        unique: false,
        index: false
    },
    vendorId: {
        type: Number,
        unique: false,
        index: false
    },
    vendorName: {
        type: String,
        unique: false,
        index: false
    },
    vendorLogo: {
        type: String,
        unique: false,
        index: false
    },
    merchantName: {
        type: String,
        unique: false,
        index: false
    },
    merchantId: {
        type: String,
        unique: false,
        index: false
    },

    merchantLogo: {
        type: String,
        unique: false,
        index: false
    },
    discount: {
        type: Number,
        unique: false,
        index: false
    },
    timestamp: {
        type: Number,
        unique: false,
        index: false
    },
    totalAmount: {
        type: Number,
        unique: false,
        index: false
    },
    kitchenId: {
        type: Number,
        unique: false,
        index: true
    },
    qaId: {
        type: Number,
        unique: false,
        index: false
    },
    qaName: {
        type: String,
        unique: false,
        index: false
    },
    orderStatus: {
        type: String,
        unique: false,
        index: true,
        default: 'incoming'
    },
    tax: {
        type: Number,
        unique: false,
        index: false
    },
    orderDetails: {
        type: Array,
        unique: false,
        index: false
    },
    declineReason: {
        menuDescription: {
            type: String,
            unique: false,
            index: false
        },
        serviceNotAvailable: {
            type: Boolean,
            unique: false,
            index: false
        }
    },
    preparationTime: {
        type: Number,
        unique: false,
        index: false
    },
    qaTime: {
        type: Number,
        unique: false,
        index: false
    }
}, {
    timestamps: true
});
module.exports = orderSchema;