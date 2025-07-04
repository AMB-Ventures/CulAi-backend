var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
    },
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "stations",
    },
    reference: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = categorySchema;
