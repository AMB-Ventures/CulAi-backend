var mongoose = require('mongoose');
var EnquirySchema = require('../schemas/enquiry.schema');

EnquirySchema.statics = {
    create: async function (data) {
        var enquiry = new this(data);
        let result = await enquiry.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, {
            "_id": 1,
            "enquiryId": 1,
            "isNewEnquiry": 1,
            "Name": 1,
            "emailId": 1,
            "password": 1,
            "mobileNumber": 1,
            "brandLogo": 1,
            "uploadFile": 1,
            "status": 1,
            "rejectionReason": 1,
            "brandName": 1,
            "cr_maroof": 1,
            "designation": 1,
            "dishes": 1,
            "assignedTo": 1,
            "services": 1,
            "WayremServices": 1,
            // "description": 1,
            "city_branches": 1,
            "subscription": 1,
            "bankDetailsUpload": 1,
            "other": 1,
            "restaurantType": 1,
            "menuList": 1,
            "menuItemsPhoto": 1,
            "nda": 1,
            "contract": 1,
            "vat": 1,
            "managementContactNo": 1,
            "managementEmail": 1,
            "managementContactNoMarketing": 1,
            "managementEmailMarketing": 1,
            "onboardingRejection": 1,
            "webSite": 1,
            "userStatus": {
                "enquiryStatus": {
                    "approved": 1,
                    "submitted": 1,
                    "correction": 1
                },
                "onboardingStatus": {
                    "approved": 1,
                    "submitted": 1,
                    "correction": 1
                },
                "cloudKitchenStatus": {
                    "approved": 1,
                    "submitted": 1,
                    "correction": 1
                }
            },
            "branchTime": {
                "branchTimeSlotStart": 1,
                "branchTimeSlotEnd": 1
            },
            "other": 1,
            "createdAt": 1,
            "updatedAt": 1
        }).sort({ "createdAt": -1 })

        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, {
            "_id": 1,
            "enquiryId": 1,
            "isNewEnquiry": 1,
            "Name": 1,
            "emailId": 1,
            "password": 1,
            "mobileNumber": 1,
            "brandLogo": 1,
            "uploadFile": 1,
            "status": 1,
            "rejectionReason": 1,
            "brandName": 1,
            "cr_maroof": 1,
            "designation": 1,
            "dishes": 1,
            "assignedTo": 1,
            "services": 1,
            "WayremServices": 1,
            // "description": 1,
            "city_branches": 1,
            // "culin_services": 1,
            "subscription": 1,
            "bankDetailsUpload": 1,
            "other": 1,
            "restaurantType": 1,
            "menuList": 1,
            "menuItemsPhoto": 1,
            "nda": 1,
            "contract": 1,
            "vat": 1,
            "managementContactNo": 1,
            "managementEmail": 1,
            "managementContactNoMarketing": 1,
            "managementEmailMarketing": 1,
            "onboardingRejection": 1,
            "webSite": 1,
            "userStatus": {
                "enquiryStatus": {
                    "approved": 1,
                    "submitted": 1,
                    "correction": 1
                },
                "onboardingStatus": {
                    "approved": 1,
                    "submitted": 1,
                    "correction": 1
                },
                "cloudKitchenStatus": {
                    "approved": 1,
                    "submitted": 1,
                    "correction": 1
                }
            },
            "branchTime": {
                "branchTimeSlotStart": 1,
                "branchTimeSlotEnd": 1
            },
            "other": 1,
            "createdAt": 1,
            "updatedAt": 1
        });
        return result;
    },
    getById: async function (query) {
        let result = await this.find(query, {
            "_id": 1,
            "enquiryId": 1,
            "isNewEnquiry": 1,
            "Name": 1,
            "emailId": 1,
            "password": 1,
            "mobileNumber": 1,
            "brandLogo": 1,
            "uploadFile": 1,
            "status": 1,
            "rejectionReason": 1,
            "brandName": 1,
            "cr_maroof": 1,
            "designation": 1,
            "dishes": 1,
            "assignedTo": 1,
            "services": 1,
            "WayremServices": 1,
            // "description": 1,
            "city_branches": 1,
            // "culin_services": 1,
            "subscription": 1,
            "bankDetailsUpload": 1,
            "other": 1,
            "restaurantType": 1,
            "menuList": 1,
            "menuItemsPhoto": 1,
            "nda": 1,
            "contract": 1,
            "vat": 1,
            "managementContactNo": 1,
            "managementEmail": 1,
            "managementContactNoMarketing": 1,
            "managementEmailMarketing": 1,
            "onboardingRejection": 1,
            "webSite": 1,
            "userStatus": {
                "enquiryStatus": {
                    "approved": 1,
                    "submitted": 1,
                    "correction": 1
                },
                "onboardingStatus": {
                    "approved": 1,
                    "submitted": 1,
                    "correction": 1
                },
                "cloudKitchenStatus": {
                    "approved": 1,
                    "submitted": 1,
                    "correction": 1
                }
            },
            "branchTime": {
                "branchTimeSlotStart": 1,
                "branchTimeSlotEnd": 1
            },
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