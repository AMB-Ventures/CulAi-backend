var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var vendorSchema = new Schema(
  {
    name: {
      type: String,
      unique: false,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    VAT: {
      type: String,
      unique: false,
      default: "",
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

module.exports = vendorSchema;
