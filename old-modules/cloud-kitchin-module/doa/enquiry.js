var mongoose = require('mongoose');
var EnquirySchema = require('../model/enquiry');

EnquirySchema.statics = {
    create: async function (data) {
        var enquiry = new this(data);
        let result = await enquiry.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "enquiryId": 1,
            "Name": 1,
            "emailId": 1,
            "mobileNumber": 1,
            "brandLogo": 1,
            "uploadFile": 1,
            "status": 1,
            "brandName": 1,
            "cr_maroof": 1,
            "designation": 1,
            "dishes": 1,
            "services":1,
            "webSite" : 1,
            "WayremServices":1,
            // "description": 1,
            "city_branches": 1,
            "other": 1,
            "createdAt": 1,
            "updatedAt": 1
        });
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, {
            "_id": 0,
            "enquiryId": 1,
            "Name": 1,
            "emailId": 1,
            "mobileNumber": 1,
            "brandLogo": 1,
            "uploadFile": 1,
            "status": 1,
            "brandName": 1,
            "cr_maroof": 1,
            "designation": 1,
            "dishes": 1,
            "services":1,
            "webSite" : 1,
            "WayremServices":1,
            // "description": 1,
            "city_branches": 1,
            "other": 1,
            "createdAt": 1,
            "updatedAt": 1
        });
        return result;
    },
    getById: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "enquiryId": 1,
            "Name": 1,
            "emailId": 1,
            "mobileNumber": 1,
            "brandLogo": 1,
            "uploadFile": 1,
            "status": 1,
            "brandName": 1,
            "cr_maroof": 1,
            "designation": 1,
            "dishes": 1,
            "services":1,
            "webSite" : 1,
            "WayremServices":1,
            // "description": 1,
            "city_branches": 1,
            "other": 1,
            "createdAt": 1,
            "updatedAt": 1
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

var enquiryModel = mongoose.model('enquiry', EnquirySchema);
module.exports = enquiryModel;