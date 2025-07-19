var mongoose = require("mongoose");
var userSchema = require("../schemas/user.schema");

userSchema.statics = {
  create: async function (data) {
    var user = new this(data);
    let result = await user.save();
    return result;
  },
  get: async function (query) {
    let result = await this.find(query)
      .populate("role vendor branch station").populate({  path: "station", model: "stations" })
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 })
      .populate("vendor role");
    return result;
  },
  getOne: async function (query) {
    let result = await this.findOne(query).populate("role vendor branch station").populate({  path: "station", model: "stations" });
    return result;
  },
  getById: async function (query) {
    let result = await this.findOne(query);
    return result;
  },
  updateOne: async function (query, updateData) {
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
  deleteM: async function (query) {
    let result = await this.deleteMany(query);
    return result;
  },
};
var userModel = mongoose.model("user", userSchema);
module.exports = userModel;
