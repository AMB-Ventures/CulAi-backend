const mongoose = require("mongoose");
const stockCountSchema = require("../schemas/stockCount.schema");

// stockCountSchema.statics = {
//   getVendorBranches: async function (query) {
//     let result = await this.find(query).sort({ createdAt: 1 });
//     return result;
//   },
//   createVendorBranch: async function (data) {
//     var branch = new this(data);
//     let result = await branch.save();
//     return result;
//   },
//   updateVendorBranch: async function (query, updateData) {
//     let result = await this.findOneAndUpdate(
//       query,
//       { $set: updateData },
//       { new: true }
//     );
//     return result;
//   },
//   deleteVendorBranches: async function (query) {
//     let result = await this.deleteMany(query);
//     return result;
//   },
// };

const stockCountModel = mongoose.model(
  "stockCount",
  stockCountSchema,
  "stockCounts"
);
module.exports = stockCountModel;
