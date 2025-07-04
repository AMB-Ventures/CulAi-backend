var mongoose = require('mongoose');
var employeeSchema = require('../model/employee');

employeeSchema.statics = {
    create: async function (data) {
        var employee = new this(data);
        let result = await employee.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, {
            "employeeId": 1,
            "emailId": 1,
            "adminId": 1,
            "kitchenId": 1,
            "role": 1,
            "Name": 1,
            "_id": 0,
            "mobileNumber": 1,
            "employeeConfig.vendorName": 1,
            "employeeConfig.menuCategory": 1,
            "employeeConfig.menuSubCategory": 1,
            "employeeConfig.menuItemSkillsRating": 1,
            "schedule": {
                "sunday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "monday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "tuesday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "wednesday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "thursday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "friday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "saturday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                }
            },
            // "password":1,
            "accessControl": {
                "order": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "menu": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "settings": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "kpireports": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "reports": {
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
    getchefbyname: async function (query) {
        let result = await this.findOne(query, {
            "employeeId": 1,
            // "emailId": 1,
            "adminId": 1,
            "kitchenId": 1,
            "role": 1,
            "Name": 1,
            "_id": 0
        });
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, {
            "employeeId": 1,
            "emailId": 1,
            "adminId": 1,
            "kitchenId": 1,
            "role": 1,
            "Name": 1,
            "_id": 0,
            "mobileNumber": 1,
            "employeeConfig.vendorName": 1,
            "employeeConfig.menuCategory": 1,
            "employeeConfig.menuSubCategory": 1,
            "employeeConfig.menuItemSkillsRating": 1,
            "schedule": {
                "sunday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "monday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "tuesday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "wednesday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "thursday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "friday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "saturday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                }
            },
            // "password":1,
            "accessControl": {
                "order": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "menu": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "settings": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "kpireports": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "reports": {
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
    getById: async function (query) {
        let result = await this.findOne(query, {
            "employeeId": 1,
            "emailId": 1,
            "adminId": 1,
            "kitchenId": 1,
            "role": 1,
            "Name": 1,
            "_id": 0,
            "mobileNumber": 1,
            "employeeConfig.vendorName": 1,
            "employeeConfig.menuCategory": 1,
            "employeeConfig.menuSubCategory": 1,
            "employeeConfig.menuItemSkillsRating": 1,
            "schedule": {
                "sunday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "monday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "tuesday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "wednesday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "thursday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "friday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                },
                "saturday": {
                    "morningTimeSlotStart": 1,
                    "afterNoonTimeSlotStart": 1,
                    "eveningTimeSlotStart": 1,
                    "nightTimeSlotStart": 1,
                    "morningTimeSlotEnd": 1,
                    "afterNoonTimeSlotEnd": 1,
                    "eveningTimeSlotEnd": 1,
                    "nightTimeSlotEnd": 1,
                    "morningTimeSlot": 1,
                    "afterNoonTimeSlot": 1,
                    "eveningTimeSlot": 1,
                    "nightTimeSlot": 1
                }
            },
            // "password":1,
            "accessControl": {
                "order": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "menu": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "settings": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "kpireports": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "reports": {
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
    getName: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "Name": 1,
            "employeeId": 1,
            "role": 1,
        });
        return result;
    },
    getList: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "accessControl": {
                "order": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "menu": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "settings": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "kpireports": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                },
                "reports": {
                    "add": 1,
                    "edit": 1,
                    "delete": 1,
                    "view": 1
                }
            }
        });
        return result;
    },
    getSpecific: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            'kitchenId': 1,
            'adminId': 1,
            'Name': 1,
            'emailId': 1,
            'mobileNumber': 1,
            'role': 1
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
    },
    deleteM: async function (query) {
        let result = await this.deleteMany(query);
        return result;
    }
}
var employeeModel = mongoose.model('employee', employeeSchema);
module.exports = employeeModel;