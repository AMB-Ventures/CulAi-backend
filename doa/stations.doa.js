const mongoose = require("mongoose");
const stationsSchema = require("../schemas/stations.schema");

stationsSchema.statics = {
  getVendorStations: async function (query) {
    let result = await this.find({ ...query })
      // .populate("branch")
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 });
    return result;
  },
  createVendorStations: async function (data) {
    var stations = new this(data);
    let result = await stations.save();

    let populatedStation = await this.findById(result._id)
      // .populate("branch")

    return populatedStation;
  },
  updateVendorStations: async function (query, updateData) {
    let result = await this.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true }
    );

    let populatedStation = await this.findById(result._id)
    // .populate("branch")

    return populatedStation;
  },
  deleteVendorStations: async function (query) {
    let result = await this.deleteMany(query);
    return result;
  },
};

const stationsModel = mongoose.model("stations", stationsSchema);
module.exports = stationsModel;
