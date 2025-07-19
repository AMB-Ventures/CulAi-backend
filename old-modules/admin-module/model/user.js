var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema(
  {
    userId: {
      type: Number,
      unique: true,
      index: true,
      required: true,
    },
    kitchenId: {
      type: Number,
      unique: false,
      index: false,
    },
    emailId: {
      type: String,
      unique: false,
      index: false,
      required: true,
    },
    name: {
      type: String,
    },
    role: {
      type: String,
      unique: false,
      index: false,
    },
    password: {
      type: String,
      unique: false,
      index: false,
    },
    lisenceKey: {
      type: String,
      unique: false,
      index: false,
    },
    updatedBy: {
      type: String,
      unique: false,
      index: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = userSchema;
