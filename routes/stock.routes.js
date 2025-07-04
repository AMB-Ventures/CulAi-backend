const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();; 
var stockController = require("../controllers/stock.controller");


router.get("/vendor-stocks", stockController.getVendorStockById);

router.get("/vendor-stock/:stockId", stockController.getVendorStockById);

router.post("/vendor-stock",upload.none(),stockController.createVendorStock);

router.patch("/vendor-stock/:stockId",upload.none(), stockController.updateVendorStock);

router.delete("/vendor-stocks", stockController.deleteVendorStocks);

module.exports = router;
