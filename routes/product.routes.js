const express = require("express");
const router = express.Router();
const { uploadSingle } = require("../controllers/s3uploader");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
var productController = require("../controllers/product.controller");

router.get(
  "/brand-category-products/:brandId/:categoryId",
  productController.getBranchProductsByBrandAndCategory
);

router.get("/vendor-products", productController.getVendorProducts);

router.get(
  "/vendor-product/:productId",
  productController.getVendorProductById
);

router.post(
  "/vendor-product",
  uploadSingle,
  productController.createVendorProduct
);

router.patch(
  "/vendor-product/:productId",
  uploadSingle,
  productController.updateVendorProduct
);

router.delete("/vendor-products", productController.deleteVendorProducts);

router.post(
  "/vendor-products/import-excel",
  upload.single("excelFile"),
  productController.importVendorProductsFromExcel
);

router.post(
  "/vendor-products/import-excel-binary",
  productController.importVendorProductsFromBinary
);

// Add route for the expected endpoint path (without /products prefix)
router.post(
  "/import-excel",
  upload.single("excelFile"),
  productController.importVendorProductsFromExcel
);

router.post(
  "/import-excel-binary",
  productController.importVendorProductsFromBinary
);

module.exports = router;
