var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor",
      required: false,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      required: false,
    },
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "stations",
      required: false,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
      required: true,
    },
    name: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    emailId: {
      type: String,
    },
    phone: {
      type: Number,
    },
    password: {
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
module.exports = userSchema;
