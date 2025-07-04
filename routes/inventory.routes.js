const express = require("express");
var router = express.Router();

var inventoryController = require("../controllers/inventory.controller");

router.get(
  "/supplier-linked-items/:supplierId",
  inventoryController.getSupplierLinkedItems
);

router.post("/produce", inventoryController.produceStock);
router.post("/purchase", inventoryController.purchaseStock);
router.post("/transfer", inventoryController.transferStock);
router.post("/adjust", inventoryController.adjustStock);

router.get("/productions", inventoryController.getStockProductions);
router.get("/purchasings", inventoryController.getStockPurchasings);
router.get("/transfers", inventoryController.getStockTransfers);
router.get("/adjustments", inventoryController.getStockAdjustments);

router.get(
  "/branch-inventory/:branchId",
  inventoryController.getBranchInventory
);

router.get("/:type?", inventoryController.getAllInventoryItems);

router.delete("/items", inventoryController.deleteVendorInventoryItems);

module.exports = router;
