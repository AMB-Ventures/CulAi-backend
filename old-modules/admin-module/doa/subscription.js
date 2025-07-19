var mongoose = require('mongoose');
var subscriptionSchema = require('../model/subscription');
subscriptionSchema.statics = {
    create: async function (data) {
        var subscription = new this(data);
        let result = await subscription.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, {
            "_id": 1,
            "title": 1,
            "features": 1,
            "publish": 1,
            "count": 1,
            "amount": 1,
            "subscriptionFrequency": 1,
            "createdAt": 1,
            "updatedAt": 1
        }).populate('features._id').sort({ "amount": -1 }).exec();
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, {
            "_id": 1,
            "title": 1,
            "features": 1,
            "publish": 1,
            "count": 1,
            "amount": 1,
            "subscriptionFrequency": 1
        });
        return result;
    },
    getById: async function (query) {
        let result = await this.find(query, {
            "_id": 1,
            "title": 1,
            "features": 1,
            "publish": 1,
            "count": 1,
            "amount": 1,
            "subscriptionFrequency": 1
        }).populate('features._id').exec();
        return result;
    },
    update: async function (query, updateData) {
        let result = await this.findOneAndUpdate(query, { $set: updateData }, { new: true });
        return result;
    },
    delete: async function (query) {
        let result = await this.findOneAndDelete(query);
        return result;
    }
}

var subscriptionModel = mongoose.model('subscriptions', subscriptionSchema);
module.exports = subscriptionModel;