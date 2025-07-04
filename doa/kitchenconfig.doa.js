var mongoose = require('mongoose');
var kitchenconfigSchema = require('../schemas/kitchenconfig.schema');

kitchenconfigSchema.statics = {
    create: async function (data) {
        var kitchenconfig = new this(data);
        let result = await kitchenconfig.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "userId": 1,
            "kitchenId": 1,
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
            "thresholdLimit": {
                "role": 1,
                "incoming": 1,
                "inPreparation": 1,
                "completed": 1,
                "all": 1
            },
            "alerts": {
                "Admin": 1,
                "Qa": 1,
                "Chef": 1,
                "Receptionist": 1
            },
        });
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, {
            "_id": 0,
            "userId": 1,
            "kitchenId": 1,
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
            "thresholdLimit": {
                "role": 1,
                "incoming": 1,
                "inPreparation": 1,
                "completed": 1,
                "all": 1
            },
            "alerts": {
                "Admin": 1,
                "Qa": 1,
                "Chef": 1,
                "Receptionist": 1
            },
        });
        return result;
    },
    getById: async function (query) {
        let result = await this.findOne(query, {
            "_id": 0,
            "userId": 1,
            "kitchenId": 1,
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
            "thresholdLimit": {
                "role": 1,
                "incoming": 1,
                "inPreparation": 1,
                "completed": 1,
                "all": 1
            },
            "alerts": {
                "Admin": 1,
                "Qa": 1,
                "Chef": 1,
                "Receptionist": 1
            },
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
var kitchenconfigModel = mongoose.model('kitchen_config', kitchenconfigSchema);
module.exports = kitchenconfigModel;