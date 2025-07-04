/*
The code defines the schema for order details object.
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var notificationsSchema = new Schema({
    entity:{type:String},
    notificationId: {
        type: Number,
        unique: true,
        index: true,
    },
    notificationUserId:{type: Number},
    description: {
        type: String
    },  
    status:{type:String}
}, {
    timestamps: true
});

module.exports = notificationsSchema;