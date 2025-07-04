var mongoose = require('mongoose');
var CategorySchema = require('../model/category');
CategorySchema.statics = {
    create: async function (data) {
        var category = new this(data);
        let result = await category.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "categoryName": 1,
            "categoryId": 1,
            "description": 1,
            "publish": 1
        });
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, {
            "_id": 0,
            "categoryName": 1,
            "categoryId": 1,
            "description": 1,
            "publish": 1
        });
        return result;
    },
    getById: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "categoryName": 1,
            "categoryId": 1,
            "description": 1,
            "publish": 1
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

var CategoryModel = mongoose.model('categories', CategorySchema);
module.exports = CategoryModel;