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
            "employeeConfig.menuItem": 1,
            "employeeConfig.skillsRating": 1,
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
                "order": 1,
                "menu": 1,
                "settings": 1
            },
            "createdAt": 1,
            "updatedAt": 1
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
            "employeeConfig.menuItem": 1,
            "employeeConfig.skillsRating": 1,
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
                "order": 1,
                "menu": 1,
                "settings": 1
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
            "employeeConfig.menuItem": 1,
            "employeeConfig.skillsRating": 1,
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
                "order": 1,
                "menu": 1,
                "settings": 1
            },
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
var employeeModel = mongoose.model('employee', employeeSchema);
module.exports = employeeModel;