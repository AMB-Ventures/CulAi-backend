var mongoose = require('mongoose');
var SubadminSchema = require('../model/subadmin');
SubadminSchema.statics = {
    create: async function (data) {
        console.log("ersklad", data)
        var subadmin = new this(data);
        let result = await subadmin.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find({ role: "sub_admin" }, {
            "_id": 0,
            "firstName": 1,
            "lastName": 1,
            "emailId": 1,
            "userId": 1,
            "role": 1,
            "password": 1,
            "status": 1,
            "cloudKitchens": 1,
            "accessControl": {
                "Registration": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "CloudKitchens": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Vendor": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "CuisineType": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "SubCuisineType": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Settings": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Features": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Subscription": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Onboarding": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Newsletter": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                }
            },
            "createdAt": 1,
            "updatedAt": 1
        }).sort({ "createdAt": -1 })
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, {
            "_id": 0,
            "firstName": 1,
            "lastName": 1,
            "emailId": 1,
            "userId": 1,
            "role": 1,
            "password": 1,
            "status": 1,
            "cloudKitchens": 1,
            "accessControl": {
                "Registration": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "CloudKitchens": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Vendor": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "CuisineType": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "SubCuisineType": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Settings": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Features": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Subscription": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Onboarding": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Newsletter": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                }
            },
        });
        return result;
    },
    getById: async function (query) {
        let result = await this.findOne(query, {
            "_id": 0,
            "firstName": 1,
            "lastName": 1,
            "emailId": 1,
            "userId": 1,
            "role": 1,
            "password": 1,
            "status": 1,
            "cloudKitchens": 1,
            "accessControl": {
                "Registration": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "CloudKitchens": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Vendor": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "CuisineType": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "SubCuisineType": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Settings": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Features": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Subscription": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Onboarding": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Newsletter": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                }
            },
            "createdAt": 1,
            "updatedAt": 1
        });
        return result;
    },
    getList: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "accessControl": {
                "Registration": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "CloudKitchens": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Vendor": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "CuisineType": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "SubCuisineType": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Settings": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Features": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Subscription": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Onboarding": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "Newsletter": {
                    "all": 1,
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                }
            }
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
var subadminModel = mongoose.model('subadmins', SubadminSchema);
module.exports = subadminModel;