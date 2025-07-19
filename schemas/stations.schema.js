var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var stationsSchema = new Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor",
    },
    // branch: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "branch",
    // },
    name: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = stationsSchema;
