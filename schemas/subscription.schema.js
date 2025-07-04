var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var subscriptionSchema = new Schema({
    title: {
        type: String,
        unique: false,
        required: false
    },
    features: [{
        _id: { type: Schema.Types.ObjectId, ref: 'features' },
        count: { type: Number }
    }],
    amount: {
        type: Number,
        unique: false,
        index: false
    },
    count: {
        type: Number,
        unique: false,
        index: false
    },
    publish: {
        type: Boolean,
        unique: false,
        index: false
    },
    subscriptionFrequency: {
        type: String,
        enum: ["Monthly", "Quaterly", "Half-yearly", "Yearly"],
        default: "Monthly"
    }
}, {
    timestamps: true
});

module.exports = subscriptionSchema;