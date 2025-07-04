var mongoose = require("mongoose");
var ShiftSchema = require("../model/shift");
ShiftSchema.statics = {
  create: async function (data) {
    var shift = new this(data);
    let result = await shift.save();
    return result;
  },
  get: async function (query) {
    let result = await this.find(query, {
      _id: 1,
      shift: 1,
      kitchenId: 1,
      startTime: 1,
      endTime: 1,
      slot: 1,
    });
    return result;
  },
  getOne: async function (query) {
    let result = await this.findOne(query, {
      _id: 1,
      shift: 1,
      kitchenId: 1,
      startTime: 1,
      endTime: 1,
      slot: 1,
    });
    return result;
  },
  getById: async function (query) {
    let result = await this.find(query, {
      _id: 1,
      shift: 1,
      kitchenId: 1,
      startTime: 1,
      endTime: 1,
      slot: 1,
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

var ShiftModel = mongoose.model("shifts", ShiftSchema);
module.exports = ShiftModel;
