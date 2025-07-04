const express = require("express");
const router = express.Router();
var categoryController = require("../controllers/category.controller");

router.get("/vendor-categories", categoryController.getVendorCategories);
router.get("/brand-categories/:brandId", categoryController.getBrandCategories);
router.post("/brand-category", categoryController.createBrandCategory);
router.put(
  "/brand-category/:categoryId",
  categoryController.updateBrandCategory
);
router.delete("/vendor-categories", categoryController.deleteVendorCategories);

module.exports = router;
