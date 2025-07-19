var mongoose = require('mongoose');
var PasswordSchema = require('../model/resetpassword');

PasswordSchema.statics = {
    create: async function (data) {
        var password = new this(data);
        let result = await password.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "emailId": 1,
            "OTP": 1
        });
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, {
            "_id": 0,
            "emailId": 1,
            "OTP": 1
        });
        return result;
    },
    getById: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "emailId": 1,
            "OTP": 1
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

var passwordModel = mongoose.model('resetpassword', PasswordSchema);
module.exports = passwordModel;