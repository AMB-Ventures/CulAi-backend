var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var stockCount = new Schema(
  {
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "vendor",
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "branch",
    },
    items: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "inventory",
        },
        stockQty: {
          type: Number,
          default: 0,
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = stockCount;
