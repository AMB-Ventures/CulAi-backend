var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const cloudKitchenSchema = new Schema(
  {
    name: {
      type: String,
      unique: false,
      index: false,
      required: true,
    },
    logo: {
      type: String,
      unique: false,
      index: false,
    },
    details: {
      type: String,
      unique: false,
      index: false,
    },
    email: {
      type: String,
      unique: false,
      index: false,
    },
    phone: {
      type: String,
      unique: false,
      index: false,
    },
  },
  { timestamps: true }
);

module.exports = cloudKitchenSchema;
