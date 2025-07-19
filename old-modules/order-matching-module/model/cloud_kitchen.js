var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const cloud_kitchenSchema = new Schema({
    kitchenName: {
        type: String,
        unique: false,
        index: false
    },
    kitchenLogo: {
        type: String,
        unique: false,
        index: false
    },
    kitchenDetails: {
        type: String,
        unique: false,
        index: false
    },
    kitchenDemographicDetails: {
        type: String,
        unique: false,
        index: false
    },
    publish: {
        type: String,
        unique: false,
        index: false
    },
    kitchenId: {
        type: Number,
        unique: true,
        index: true
    },
    kitchenEmail: {
        type: String,
        unique: true,
        index: true
    },
    status: {
        type: Boolean,
        unique: false,
        index: false
    },
    autoAssign: {
        type: String,
        unique: false,
        index: false
    },
    busy: {
        type: Boolean,
        unique: false,
        index: false
    },
    merchantConfig: [{
        vendorId: {
            type: Number,
            unique: false,
            index: false
        },
        merchantId: {
            type: String,
            unique: false,
            index: false
        },
        merchantName: {
            type: String,
            unique: false,
            index: false
        },
        merchantLogo: {
            type: String,
            unique: false,
            index: false
        }
    }],
}, { timestamps: true });



module.exports = cloud_kitchenSchema;