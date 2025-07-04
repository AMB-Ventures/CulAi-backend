var mongoose = require("mongoose");
var roleSchema = require("../model/role");
roleSchema.statics = {
  create: async function (data) {
    var feature = new this(data);
    let result = await feature.save();
    return result;
  },
  get: async function (query) {
    let result = await this.find(query, {
      _id: 1,
      role: 1,
      kitchenId: 1,
      status: 1,
      description: 1,
      accessControl: 1,
    }).sort({ createdAt: -1 });
    return result;
  },
  getOne: async function (query) {
    let result = await this.findOne(query, {
      _id: 1,
      role: 1,
      kitchenId: 1,
      status: 1,
      description: 1,
      accessControl: 1,
    });
    return result;
  },
  getById: async function (query) {
    let result = await this.findById(query, {
      _id: 1,
      role: 1,
      kitchenId: 1,
      status: 1,
      description: 1,
      accessControl: 1,
    });
    return result;
  },
  update: async function (query, updateData) {
    let result = await this.findOneAndUpdate(query, { $set: updateData });
    return result;
  },
  delete: async function (query) {
    let result = await this.findOneAndDelete(query);
    return result;
  },
};

var roleModel = mongoose.model("roles", roleSchema);
module.exports = roleModel;
