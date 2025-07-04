var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var featureSchema = new Schema(
  {
    featureName: {
      type: String,
      unique: false,
      index: false,
    },
    featureDataType: {
      type: String,
      unique: false,
      index: false,
    },
    featureConstant: {
      type: String,
      enum: ["no_of_employees", "no_of_menus", "pos"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = featureSchema;
