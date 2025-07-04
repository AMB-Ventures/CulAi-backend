const express = require("express");
const router = express.Router();
var dashboard = require("../controllers/dashboard.controller");

router.get("/vendor/general/stats", dashboard.getVendorGeneralDashboardStats);
router.get(
  "/vendor/inventory/stats",
  dashboard.getVendorInventoryDashboardStats
);
router.get("/vendor/inventory/recursion", dashboard.getProductionCostOfItems);

module.exports = router;
