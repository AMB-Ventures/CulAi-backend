var mongoose = require('mongoose');
var userSchema = require('../model/user');

userSchema.statics = {
    create: async function (data) {
        var user = new this(data);
        let result = await user.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, { userId: 1, kitchenId: 1, emailId: 1, role: 1, password: 1, _id: 0, lisencekey: 1, updatedBy: 1, createdAt: 1, updatedAt: 1 });
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, { userId: 1, kitchenId: 1, role: 1, emailId: 1, password: 1, _id: 0, lisencekey: 1, updatedBy: 1, createdAt: 1, updatedAt: 1 });
        return result;
    },
    getById: async function (query) {
        let result = await this.findOne(query, { userId: 1, kitchenId: 1, emailId: 1, role: 1, password: 1, _id: 0, lisencekey: 1, updatedBy: 1, createdAt: 1, updatedAt: 1 });
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
    },
    // countkpis: async function(query) {
    //     let result = await this.countDocuments((count) => count);
    //     return result;
    // }
}
var userModel = mongoose.model('user', userSchema);
module.exports = userModel;