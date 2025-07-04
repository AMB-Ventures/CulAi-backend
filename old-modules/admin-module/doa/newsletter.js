var mongoose = require('mongoose');
var newsletterSchema = require('../model/newsletter');
newsletterSchema.statics = {
    create: async function (data) {
        var newsletter = new this(data);
        let result = await newsletter.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, {
            "_id": 1,
            "description": 1,
            "createdAt": 1,
            "updatedAt": 1
        }).sort({ "createdAt": -1 })
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, {
            "_id": 1,
            "description": 1,
            "createdAt": 1,
            "updatedAt": 1
        });
        return result;
    },
    getById: async function (query) {
        let result = await this.find(query, {
            "_id": 1,
            "description": 1,
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

var newsletterModel = mongoose.model('newsletter', newsletterSchema);
module.exports = newsletterModel;