var mongoose = require('mongoose');
var notificationSchema = require('../schemas/notifications.schema');
notificationSchema.statics = {
    create: async function (data) {
        var notification = new this(data);
        let result = await notification.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, {
            _id: 1,
            entity: 1,
            notificationId: 1,
            description: 1,
            notificationUserId:1,
            status: 1,
            createdAt: 1,
            updatedAt: 1
        }).sort({ "createdAt": -1 })
        return result;
    },
}

var notificationModel = mongoose.model('notification', notificationSchema);
module.exports = notificationModel;