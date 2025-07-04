const mongoose = require("mongoose");
const categorySchema = require("../schemas/menu/category.schema");
categorySchema.statics = {
  create: async function (data) {
    const category = new this(data);
    let result = await category.save();
    return result;
  },
  get: async function (query) {
    let result = await this.find(query, {
      _id: 1,
      categoryName: 1,
      categoryId: 1,
      description: 1,
      publish: 1,
      createdAt: 1,
      updatedAt: 1,
    }).sort({ createdAt: 1 });
    return result;
  },
  getOne: async function (query) {
    let result = await this.findOne(query, {
      _id: 0,
      categoryName: 1,
      categoryId: 1,
      description: 1,
      publish: 1,
    });
    return result;
  },
  getById: async function (query) {
    let result = await this.find(query, {
      _id: 0,
      categoryName: 1,
      categoryId: 1,
      description: 1,
      publish: 1,
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

const categoryModel = mongoose.model("category", categorySchema);
module.exports = categoryModel;
