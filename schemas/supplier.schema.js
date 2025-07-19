var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var supplierSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
    contactName: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      index: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "vendor",
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

module.exports = supplierSchema;
