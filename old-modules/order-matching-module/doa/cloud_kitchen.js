var mongoose = require('mongoose');
var cloud_kitchenSchema = require('../model/cloud_kitchen');

cloud_kitchenSchema.statics = {
    create: async function (data) {
        var cloud_kitchen = new this(data);
        let result = await cloud_kitchen.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "kitchenName": 1,
            "kitchenLogo": 1,
            "kitchenDetails": 1,
            "kitchenDemographicDetails": 1,
            "kitchenId": 1,
            "kitchenEmail": 1,
            "status": 1,
            "busy": 1,
            "publish": 1,
            "autoAssign": 1,
            "merchantConfig.vendorId": 1,
            "merchantConfig.merchantId": 1,
            "merchantConfig.merchantName": 1,
            "merchantConfig.merchantLogo": 1
        });
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, {
            "_id": 0,
            "kitchenName": 1,
            "kitchenLogo": 1,
            "kitchenDetails": 1,
            "kitchenDemographicDetails": 1,
            "kitchenId": 1,
            "kitchenEmail": 1,
            "status": 1,
            "busy": 1,
            "publish": 1,
            "autoAssign": 1,
            "merchantConfig.vendorId": 1,
            "merchantConfig.merchantId": 1,
            "merchantConfig.merchantName": 1,
            "merchantConfig.merchantLogo": 1
        });
        return result;
    },
    getById: async function (query) {
        let result = await this.findOne(query, {
            "_id": 0,
            "kitchenName": 1,
            "kitchenLogo": 1,
            "kitchenDetails": 1,
            "kitchenDemographicDetails": 1,
            "kitchenId": 1,
            "kitchenEmail": 1,
            "status": 1,
            "busy": 1,
            "publish": 1,
            "autoAssign": 1,
            "merchantConfig.vendorId": 1,
            "merchantConfig.merchantId": 1,
            "merchantConfig.merchantName": 1,
            "merchantConfig.merchantLogo": 1
        });
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
var cloudkitchenModel = mongoose.model('cloud_kitchens', cloud_kitchenSchema);
module.exports = cloudkitchenModel;