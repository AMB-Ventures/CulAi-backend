const mongoose = require("mongoose");
const stockTransferSchema = require("../schemas/stockTransfer.schema");

const stockTransferModel = mongoose.model(
  "stockTransfer",
  stockTransferSchema,
  "stockTransfers"
);
module.exports = stockTransferModel;
