/*
The code below act as database access layer for employee based ops.
*/

var mongoose = require('mongoose');
var inquirySchema = require('../model/inquiry');

inquirySchema.statics = {
    create: async function (data) {
        var inquiry = new this(data);
        let result = await inquiry.save();
        return result;
    },

    get: async function (query) {
        let result = await this.find({ status: "pending" },
            {
                "_id": 0,
                "kitchenName": 1,
                "kitchenLogo": 1,
                "address": 1,
                "city": 1,
                "country": 1,
                "state": 1,
                "inquiryId": 1,
                "phoneNumber": 1,
                "emailId": 1,
                "status": 1
            });
        return result;
    },

    getById: async function (query) {
        let result = await this.findOne(query,
            {
                "_id": 0,
                "kitchenName": 1,
                "kitchenLogo": 1,
                "address": 1,
                "city": 1,
                "country": 1,
                "state": 1,
                "inquiryId": 1,
                "phoneNumber": 1,
                "emailId": 1,
                "status": 1,
            });
        return result;
    },

    getOne: async function (query) {
        let result = await this.findOne(query,
            {
                "_id": 0,
                "kitchenName": 1,
                "kitchenLogo": 1,
                "address": 1,
                "city": 1,
                "country": 1,
                "state": 1,
                "inquiryId": 1,
                "phoneNumber": 1,
                "emailId": 1,
                "status": 1
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

    // countOnboards: async function () {
    //     let result = await this.countDocuments((count) => count);
    //     return result;
    // }
}

var inquiryModel = mongoose.model('inquiry', inquirySchema);
module.exports = inquiryModel;