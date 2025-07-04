var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var customerSchema = new Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "vendor",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
      required: true,
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);
module.exports = customerSchema;
