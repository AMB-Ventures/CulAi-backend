var mongoose = require("mongoose");
const order = require("../doa/order.doa");
const orderSchema = require("../schemas/order.schema");

const getVendorSalesReport = async (req, res, next) => {};

const getVendorInventoryReport = async (req, res, next) => {};

module.exports = {
  getVendorSalesReport,
  getVendorInventoryReport,
};
