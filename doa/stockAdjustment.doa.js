const mongoose = require("mongoose");
const stockAdjustmentSchema = require("../schemas/stockAdjustment.schema");

const stockAdjustmentModel = mongoose.model(
  "stockAdjustment",
  stockAdjustmentSchema,
  "stockAdjustments"
);
module.exports = stockAdjustmentModel;
