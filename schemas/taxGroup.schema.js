var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var taxGroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = taxGroupSchema;
