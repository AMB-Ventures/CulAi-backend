var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

var stockProductionSchema = new Schema(
  {
    batchId: {
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
    productionDate: {
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

stockProductionSchema.pre("save", function (next) {
  this.batchId = uuidv4();
  next();
});

module.exports = stockProductionSchema;
