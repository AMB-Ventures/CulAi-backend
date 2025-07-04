const express = require("express");
var router = express.Router();
var supplierController = require("../controllers/supplier.controller");

// const Joi = require("joi");

// const querySchemaCreateOrGetAllCustomers = Joi.object().keys({
//   customerName: Joi.string().required(),
//   phone: Joi.string().required(),
//   role: Joi.string(),
//   kitchenId: Joi.array(),
// });

// const querySchemaUpdateOrDeleteCustomer = Joi.object({
//   customerId: Joi.string().required(),
// });

router.get("/vendor-suppliers", supplierController.getVendorSuppliers);
router.post("/vendor-supplier", supplierController.createVendorSupplier);
router.put(
    "/update-vendor-supplier/:supplierId",
    supplierController.updateVendorSupplier
  );
router.delete("/vendor-suppliers", supplierController.deleteVendorSupplier);

module.exports = router;
