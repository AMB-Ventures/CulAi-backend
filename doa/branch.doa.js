const mongoose = require("mongoose");
const branchSchema = require("../schemas/branch.schema");

branchSchema.statics = {
  getVendorBranches: async function (query) {
    let result = await this.find({ ...query, type: "outlet" })
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 });
    return result;
  },
  getVendorWarehouses: async function (query) {
    let result = await this.find({ ...query, type: "warehouse" })
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 });
    return result;
  },
  createVendorBranch: async function (data) {
    var branch = new this(data);
    let result = await branch.save();
    return result;
  },
  createVendorWarehouse: async function (data) {
    var branch = new this(data);
    let result = await branch.save();
    return result;
  },
  updateVendorBranch: async function (query, updateData) {
    let result = await this.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true }
    );
    return result;
  },
  deleteVendorBranches: async function (query) {
    let result = await this.deleteMany(query);
    return result;
  },
};

const branchModel = mongoose.model("branch", branchSchema);
module.exports = branchModel;
