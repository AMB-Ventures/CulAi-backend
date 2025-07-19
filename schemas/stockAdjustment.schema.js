var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

var stockAdjustmentSchema = new Schema(
  {
    adjustmentId: {
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
    adjustmentDate: {
      type: Date,
      required: true,
    },
    items: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "inventory",
        },
        deltaQty: {
          type: Number,
          default: 0,
        },
        reason: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

stockAdjustmentSchema.pre("save", function (next) {
  this.adjustmentId = uuidv4();
  next();
});

module.exports = stockAdjustmentSchema;
