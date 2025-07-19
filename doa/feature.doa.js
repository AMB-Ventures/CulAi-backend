var mongoose = require('mongoose');
var featureSchema = require('../schemas/feature.schema');
featureSchema.statics = {
    create: async function (data) {
        var feature = new this(data);
        let result = await feature.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, {
            "_id": 1,
            "featureName": 1,
            "featureDataType": 1,
            "featureConstant": 1,
            "createdAt": 1,
            "updatedAt": 1
        }).sort({ "createdAt": -1 })
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, {
            "_id": 1,
            "featureName": 1,
            "featureDataType": 1,
            "featureConstant": 1
        });
        return result;
    },
    getById: async function (query) {
        let result = await this.find(query, {
            "_id": 1,
            "featureName": 1,
            "featureDataType": 1,
            "featureConstant": 1
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

var featureModel = mongoose.model('features', featureSchema);
module.exports = featureModel;