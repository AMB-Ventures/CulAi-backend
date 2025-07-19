const express = require("express");
const router = express.Router();
const { uploadSingle } = require("../controllers/s3uploader"); // Import S3 uploader
const vendor = require("../controllers/vendor.controller");
const productController = require("../controllers/product.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Joi = require("joi");
const auth = require("../middlewares/auth");
const validator = require("express-joi-validation").createValidator({});

// Custom middleware to handle both multipart and JSON requests
const handleImportRequest = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";

  if (contentType.includes("multipart/form-data")) {
    // Handle as multipart form data
    return upload.single("excelFile")(req, res, next);
  } else if (contentType.includes("application/json")) {
    // Handle as JSON - just pass through
    return next();
  } else {
    // Try to handle as multipart anyway (for cases where content-type is not set properly)
    return upload.single("excelFile")(req, res, next);
  }
};

const querySchemaCreateOrGetAllvendor = Joi.object().keys({
  vendorName: Joi.string().required(),
  licenseKey: Joi.string().required(),
  webHookUrl: Joi.string().required(),
});

const querySchemaUpdateOrDeletevendor = Joi.object({
  vendorId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});
const querySchemaExport = Joi.object({
  exportType: Joi.string().required(),
});

router.get("/vendors", vendor.getVendors);
router.post("/vendor", uploadSingle, vendor.createVendor);

router.get(
  "/vendor/:vendorId",
  validator.params(querySchemaUpdateOrDeletevendor),
  vendor.getVendorById
);
router.put(
  "/vendor/:vendorId",
  uploadSingle,
  validator.params(querySchemaUpdateOrDeletevendor),
  vendor.updateVendor
);
router.delete(
  "/vendor/:vendorId",
  validator.params(querySchemaUpdateOrDeletevendor),
  vendor.removeVendor
);

// Add product import endpoints to vendor routes
router.post(
  "/vendor-products/import-excel",
  handleImportRequest,
  productController.importVendorProductsFromExcel
);

router.post(
  "/vendor-products/import-excel-binary",
  productController.importVendorProductsFromBinary
);

// Test endpoint to debug request format
router.post("/test-binary-upload", (req, res) => {
  console.log("=== TEST ENDPOINT DEBUG ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Content-Type header:", req.headers["content-type"]);
  console.log("Content-Length header:", req.headers["content-length"]);
  console.log("All headers:", req.headers);
  console.log("Request body type:", typeof req.body);
  console.log("Request body keys:", Object.keys(req.body || {}));
  console.log("Request body:", req.body);
  console.log("Raw body available:", !!req.body);
  console.log("==========================");

  res.json({
    message: "Test endpoint working",
    received: {
      method: req.method,
      url: req.url,
      contentType: req.headers["content-type"],
      contentLength: req.headers["content-length"],
      bodyKeys: Object.keys(req.body || {}),
      hasFileData: !!req.body?.fileData,
      bodyType: typeof req.body,
      bodyValue: req.body,
    },
  });
});

// router.get('/vendor/:exportType/export-document', [auth.verifyToken, auth.isSuperAdmin], validator.params(querySchemaExport), vendor.exportDocument);
// router.patch('/vendor/:vendorId/publish-status', [auth.verifyToken, auth.isSuperAdmin], vendor.updatePublish);

module.exports = router;
