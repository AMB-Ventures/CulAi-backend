var mongoose = require("mongoose");
var customerSchema = require("../schemas/customer.schema");

customerSchema.statics = {
  create: async function (data) {
    var customer = new this(data);
    let result = await customer.save();
    return result;
  },
  get: async function (query) {
    let result = await this.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 });
    return result;
  },
  getOne: async function (query) {
    let result = await this.findOne(query);
    return result;
  },
  getById: async function (query) {
    let result = await this.findOne(query);
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
var customerModel = mongoose.model("customer", customerSchema);
module.exports = customerModel;
