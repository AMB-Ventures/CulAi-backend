const express = require("express");
const router = express.Router();
var brandController = require("../controllers/brand.controller");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const querySchemaCreateOrGetAllBrand = Joi.object().keys({
  brandName: Joi.string().required(),
  description: Joi.string().required(),
});

const querySchemaUpdateOrDeleteBrand = Joi.object({
  brandId: Joi.string().required(),
});
const querySchemaExport = Joi.object({
  exportType: Joi.string().required(),
});

router.get("/vendor-brands/:status?", brandController.getVendorBrands);
router.post("/vendor-brand", brandController.createVendorBrand);
router.put("/vendor-brand/:brandId", brandController.updateBrand);
router.delete("/vendor-brand", brandController.deleteBrands);
module.exports = router;
