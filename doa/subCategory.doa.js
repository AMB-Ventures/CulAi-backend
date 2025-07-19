var mongoose = require('mongoose');
var SubCategorySchema = require('../schemas/sub_category.schema');
SubCategorySchema.statics = {
    create: async function (data) {
        var category = new this(data);
        let result = await category.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "categoryName": 1,
            "categoriesId":1,
            "subCategoryName": 1,
            "subCategoryId": 1,
            "categoryId":1,
            "description": 1,
            "publish": 1,
            "createdAt": 1,
            "updatedAt": 1
        }).sort({ "createdAt": -1 })
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, {
            "_id": 0,
            "categoryName": 1,
            "subCategoryName": 1,
            "categoriesId":1,
            "categoryId":1,
            "subCategoryId": 1,
            "description": 1,
            "publish": 1
        });
        return result;
    },
    getById: async function (query) {
        let result = await this.find(query, {
            "_id": 0,
            "categoryName": 1,
            "subCategoryName": 1,
            "categoriesId":1,
            "subCategoryId": 1,
            "categoryId":1,
            "description": 1,
            "publish": 1
        });
        return result;
    },
    getByCategoryId: async function (query) {
        let result = await this.find({categoryId:query } , {
            "_id": 1,
            "categoryName": 1,
            "subCategoryName": 1,
            "categoryId":1,
            "subCategoryId": 1,
            "description": 1,
            "publish": 1
        }).sort({ "createdAt": -1 });
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

var subCategoryModel = mongoose.model('sub_category', SubCategorySchema);
module.exports = subCategoryModel;