var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var branchSchema = new Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor",
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: ["outlet", "warehouse"],
      default: "outlet",
      required: true,
    },
    reference: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
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

module.exports = branchSchema;
