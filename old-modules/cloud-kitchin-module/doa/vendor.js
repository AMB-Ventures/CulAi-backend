var mongoose = require('mongoose');
var VendorSchema = require('../model/vendor');

VendorSchema.statics = {
    create: async function (data) {
        var vendor = new this(data);
        let result = await vendor.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "vendorName": 1,
            "vendorId": 1,
            "vendorLogo": 1,
            "licenseKey": 1,
            "publish": 1,
            "webHookUrl": 1
        });
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, {
            "_id": 0,
            "vendorName": 1,
            "vendorId": 1,
            "vendorLogo": 1,
            "licenseKey": 1,
            "publish": 1,
            "webHookUrl": 1
        });
        return result;
    },
    getById: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "vendorName": 1,
            "vendorId": 1,
            "vendorLogo": 1,
            "licenseKey": 1,
            "webHookUrl": 1,
            "publish": 1,
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

var vendorModel = mongoose.model('vendor', VendorSchema);
module.exports = vendorModel;