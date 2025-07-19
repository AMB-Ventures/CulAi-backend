var mongoose = require("mongoose");
var MenuSchema = require("../model/menu");
MenuSchema.statics = {
  create: async function (data) {
    var menu = new this(data);
    let result = await menu.save();
    return result;
  },

  get: async function (query) {
    let result = await this.find(query, {
      _id: 0,
      kitchenId: 1,
      userId: 1,
      menuId: 1,
      menuName: 1,
      category: 1,
      subcategory: 1,
      description: 1,
      uploadImage: 1,
      uploadVideo: 1,
      preparationTime: 1,
      ingredients: 1,
      "chefConfig.chef": 1,
      "chefConfig.skillsRating": 1,
      phases: 1,
      "vendorConfig.vendorId": 1,
      "vendorConfig.vendorMenuId": 1,
      available: 1,
      createdAt: 1,
      updatedAt: 1,
    }).sort({ createdAt: -1 });
    return result;
  },
  getOne: async function (query) {
    let result = await this.findOne(query, {
      _id: 0,
      kitchenId: 1,
      userId: 1,
      menuId: 1,
      menuName: 1,
      category: 1,
      subcategory: 1,
      description: 1,
      uploadImage: 1,
      uploadVideo: 1,
      preparationTime: 1,
      ingredients: 1,
      "chefConfig.chef": 1,
      "chefConfig.skillsRating": 1,
      phases: 1,
      "vendorConfig.vendorId": 1,
      "vendorConfig.vendorMenuId": 1,
      available: 1,
      createdAt: 1,
      updatedAt: 1,
    });
    return result;
  },
  getById: async function (query) {
    let result = await this.find(query, {
      _id: 0,
      kitchenId: 1,
      userId: 1,
      menuId: 1,
      menuName: 1,
      category: 1,
      subcategory: 1,
      description: 1,
      uploadImage: 1,
      uploadVideo: 1,
      preparationTime: 1,
      ingredients: 1,
      "chefConfig.chef": 1,
      "chefConfig.skillsRating": 1,
      phases: 1,
      "vendorConfig.vendorId": 1,
      "vendorConfig.vendorMenuId": 1,
      available: 1,
      // "timeStamp": 1
      createdAt: 1,
      updatedAt: 1,
    });
    return result;
  },
  getSubCat: async function (query) {
    let result = await this.find(query, {
      _id: 0,
      category: 1,
      subcategory: 1,
    });
    return result;
  },
  update: async function (query, updateData) {
    let result = await this.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true }
    );
    return result;
  },
  delete: async function (query) {
    let result = await this.findOneAndDelete(query);
    return result;
  },
};

var MenuModel = mongoose.model("menu", MenuSchema);
module.exports = MenuModel;
