var mongoose = require("mongoose");
var suppliersSchema = require("../schemas/supplier.schema");

suppliersSchema.statics = {
  createVendorSupplier: async function (data) {
    var supplier = new this(data);
    let result = await supplier.save();
    return result;
  },
  getVendorSuppliers: async function (query) {
    let result = await this.find(query).sort({ "createdAt": 1 });
    return result;
  },
  getOne: async function (query) {
    let result = await this.findOne(query).sort({ "createdAt": 1 });
    return result;
  },
  getById: async function (query) {
    let result = await this.findOne(query).sort({ "createdAt": 1 });
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
  deleteM: async function (query) {
    let result = await this.deleteMany(query);
    return result;
  },
};
var suppliersModel = mongoose.model("suppliers", suppliersSchema);
module.exports = suppliersModel;
