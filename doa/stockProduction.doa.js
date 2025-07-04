const mongoose = require("mongoose");
const stockProductionSchema = require("../schemas/stockProduction.schema");

const stockProductionModel = mongoose.model(
  "stockProduction",
  stockProductionSchema,
  "stockProductions"
);

module.exports = stockProductionModel;
