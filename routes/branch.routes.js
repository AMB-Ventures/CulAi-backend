const express = require("express");
const router = express.Router();
var branchController = require("../controllers/branch.controller");

// const Joi = require("joi");
// const validator = require("express-joi-validation").createValidator({});

router.get(
  "/vendor-warehouses/:vendorId?",
  branchController.getVendorWarehouses
);
router.get("/vendor-branches/all", branchController.getAllVendorBranches);
router.get("/vendor-branches/:vendorId?", branchController.getVendorBranches);

router.post("/vendor-branch", branchController.createVendorBranch);
router.post("/vendor-warehouse", branchController.createVendorWarehouses);
router.put("/vendor-branch/:branchId", branchController.updateVendorBranch);
router.put(
  "/vendor-warehouse/:warehouseId",
  branchController.updateVendorWarehouse
);
router.delete("/vendor-branches", branchController.deleteVendorBranches);
router.delete("/vendor-warehouses", branchController.deleteVendorWarehouses);

module.exports = router;
