const express = require("express");
const router = express.Router();
var reports = require("../controllers/reports.controller");

router.get("/vendor/reports/sales/", reports.getVendorSalesReport);
router.get("/vendor/reports/inventory/", reports.getVendorInventoryReport);

module.exports = router;
