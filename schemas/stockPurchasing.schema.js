var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

var stockPurchasingSchema = new Schema(
  {
    purchaseOrderId: {
      type: String,
      unique: true,
      index: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "vendor",
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "branch",
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "supplier",
    },
    purchasingDate: {
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
        totalPrice: {
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

stockPurchasingSchema.pre("save", function (next) {
  this.purchaseOrderId = uuidv4();
  next();
});

module.exports = stockPurchasingSchema;
