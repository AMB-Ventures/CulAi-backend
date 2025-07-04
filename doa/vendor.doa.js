var mongoose = require("mongoose");
var vendorSchema = require("../schemas/vendor.schema");

vendorSchema.statics = {
  create: async function (data) {
    var vendor = new this(data);
    let result = await vendor.save();
    return result;
  },
  get: async function (query) {
    let result = await this.find(query).sort({ createdAt: 1 });
    return result;
  },
  getOne: async function (query) {
    let result = await this.findOne(query);
    return result;
  },
  getById: async function (query) {
    let result = await this.find(query, {
      _id: 1,
      name: 1,
      image: 1,
      VAT: 1,
      status: 1,
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

var vendorModel = mongoose.model("vendor", vendorSchema);
module.exports = vendorModel;
