var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

var stockTransferSchema = new Schema(
  {
    transferId: {
      type: String,
      unique: true,
      index: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "vendor",
    },
    sourceBranch: {
      type: Schema.Types.ObjectId,
      ref: "branch",
    },
    destinationBranch: {
      type: Schema.Types.ObjectId,
      ref: "branch",
    },
    transferDate: {
      type: Date,
      required: true,
    },
    items: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "inventory",
        },
        qty: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

stockTransferSchema.pre("save", function (next) {
  this.transferId = uuidv4();
  next();
});

module.exports = stockTransferSchema;
