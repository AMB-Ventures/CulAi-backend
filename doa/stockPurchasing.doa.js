const mongoose = require("mongoose");
const stockPurchasingSchema = require("../schemas/stockPurchasing.schema");

const stockPurchasingModel = mongoose.model(
  "stockPurchasing",
  stockPurchasingSchema,
  "stockPurchasings"
);
module.exports = stockPurchasingModel;
