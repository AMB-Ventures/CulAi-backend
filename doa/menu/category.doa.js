const mongoose = require("mongoose");
const categorySchema = require("../../schemas/menu/category.schema");

categorySchema.statics = {
  createBrandCategory: async function (data) {
    var category = new this(data);
    let result = await category.save();
    return result;
  },
  get: async function (query) {
    let result = await this.find(query)
      .populate("brand").populate({  path: "station", model: "stations" })
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 });
    return result;
  },
  getById: async function (id) {
    let result = await this.findById(id)
      .populate("brand").populate({  path: "station", model: "stations" })
      .sort({ createdAt: 1 });
    return result;
  },
};

const categoryModel = mongoose.model("category", categorySchema);
module.exports = categoryModel;
