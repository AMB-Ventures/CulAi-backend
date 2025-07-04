var mongoose = require("mongoose");
var inventory = require("../doa/inventory.doa");
var stockCount = require("../doa/stockCount.doa");

var stockProduction = require("../doa/stockProduction.doa");
var stockPurchasing = require("../doa/stockPurchasing.doa");
var stockTransfer = require("../doa/stockTransfer.doa");
var stockAdjustment = require("../doa/stockAdjustment.doa");

const getAllInventoryItems = async (req, res, next) => {
  try {
    let query = { vendor: req.user.vendor._id };
    if (!!req.params.type) query.__type = req.params.type;
    let result = await inventory.getVendorInventory(query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: e.message });
  }
};

const getBranchInventory = async (req, res, next) => {
  try {
    const branchId = mongoose.Types.ObjectId(req.params.branchId);
    const vendorId = mongoose.Types.ObjectId(req.user.vendor._id);

    const result = await stockCount
      .aggregate([
        {
          $match: {
            vendor: vendorId,
            branch: branchId,
          },
        },
        {
          $lookup: {
            from: "inventories", // Change to the actual name of the inventory collection
            localField: "items.item",
            foreignField: "_id",
            as: "populatedItems",
          },
        },
        {
          $unwind: "$items",
        },
        {
          $match: {
            "items.item": { $ne: null },
          },
        },
        {
          $lookup: {
            from: "inventories", // Change to the actual name of the inventory collection
            localField: "items.item",
            foreignField: "_id",
            as: "items.item",
          },
        },
        {
          $unwind: "$items.item",
        },
        {
          $project: {
            _id: 1,
            branch: 1,
            vendor: 1,
            createdAt: 1,
            updatedAt: 1,
            items: {
              _id: "$items._id",
              stockQty: "$items.stockQty",
              item: "$items.item", // Retain the populated item information
            },
          },
        },
        {
          $sort: {
            "items.item.name": 1, // Sort items by stockQty in descending order
          },
        },
        {
          $group: {
            _id: "$_id",
            branch: { $first: "$branch" },
            vendor: { $first: "$vendor" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            items: { $push: "$items" },
          },
        },
      ])
      .collation({ locale: "en", strength: 2 });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSupplierLinkedItems = async (req, res, next) => {
  try {
    let result = await inventory
      .find({
        vendor: req.user.vendor._id,
        branch: req.params.branchId,
        "suppliers.supplier": req.params.supplierId,
      })
      .sort({ createdAt: 1 })
      .populate("supplier");
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: e.message });
  }
};

const getStockProductions = async (req, res, next) => {
  try {
    let result = await stockProduction
      .find({ vendor: req.user.vendor._id })
      .sort({ createdAt: -1 })
      .populate("branch")
      .populate({ path: "items.item", model: "inventory" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: e.message });
  }
};

const produceStock = async (req, res, next) => {
  try {
    const branchId = req.body.branch.value; // Assuming you have the stockCountId available
    const items = req.body.items;

    const stockProductionDoc = new stockProduction({
      vendor: req.user.vendor._id,
      branch: branchId,
      productionDate: req.body.productionDate,
      items: req.body.items.map((item) => ({
        item: item.product.value,
        qty: item.qty,
      })),
    });

    const stockCounts = await stockCount.findOne({ branch: branchId });

    items.forEach((element) => {
      const stockCountIndex = stockCounts.items.findIndex(
        (stockCountItem) =>
          stockCountItem.item.toString() === element.product.value
      );
      if (stockCountIndex === -1) {
        stockCounts.items.push({
          item: element.product.value,
          stockQty: element.qty,
        });
      } else {
        stockCounts.items[stockCountIndex].stockQty += element.qty;
      }

      element.product.ingredients.forEach((ingredient) => {
        const ingredientStockCountIndex = stockCounts.items.findIndex(
          (stockCountItem) => stockCountItem.item.toString() === ingredient.item
        );
        if (ingredientStockCountIndex === -1) {
          stockCounts.items.push({
            item: ingredient.item,
            stockQty: -1 * ingredient.qty * element.qty,
          });
        } else {
          stockCounts.items[ingredientStockCountIndex].stockQty -=
            ingredient.qty * element.qty;
        }
      });
    });

    Promise.all([stockProductionDoc.save(), stockCounts.save()]);

    res.status(200).json({ message: "Stock updated successfully" });
    req.app.io.emit(`reload_${req.user.vendor._id}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while updating stock" });
  }
};

const getStockPurchasings = async (req, res, next) => {
  try {
    let result = await stockPurchasing
      .find({ vendor: req.user.vendor._id })
      .sort({ createdAt: -1 })
      .populate("branch")
      .populate({ path: "items.item", model: "inventory" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: e.message });
  }
};

const purchaseStock = async (req, res, next) => {
  try {
    const branchId = req.body.branch.value;
    const items = req.body.items;

    const stockPurchasingDoc = new stockPurchasing({
      vendor: req.user.vendor._id,
      branch: branchId,
      purchasingDate: req.body.purchasingDate,
      items: req.body.items.map((item) => ({
        item: item.product.value,
        qty: item.qty,
        totalPrice: item.price,
      })),
    });

    const stockCounts = await stockCount.findOne({ branch: branchId });

    items.forEach((element) => {
      const stockCountIndex = stockCounts.items.findIndex(
        (stockCountItem) =>
          stockCountItem.item.toString() === element.product.value
      );
      if (stockCountIndex === -1) {
        stockCounts.items.push({
          item: element.product.value,
          stockQty: element.qty,
        });
      } else {
        stockCounts.items[stockCountIndex].stockQty += element.qty;
      }
    });

    Promise.all([stockPurchasingDoc.save(), stockCounts.save()]);

    res.status(200).json({ message: "Stock purchased successfully" });
    req.app.io.emit(`reload_${req.user.vendor._id}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while purchasing stock" });
  }
};

const getStockTransfers = async (req, res, next) => {
  try {
    let result = await stockTransfer
      .find({ vendor: req.user.vendor._id })
      .sort({ createdAt: -1 })
      .populate({ model: "branch", path: "sourceBranch" })
      .populate({ model: "branch", path: "destinationBranch" })
      .populate({ path: "items.item", model: "inventory" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: e.message });
  }
};

const transferStock = async (req, res, next) => {
  try {
    const sourceBranch = req.body.sourceBranch?.value;
    const destinationBranch = req.body.destinationBranch?.value;
    const items = req.body.items;

    const stockTransferDoc = new stockTransfer({
      vendor: req.user.vendor._id,
      sourceBranch: sourceBranch,
      destinationBranch: destinationBranch,
      transferDate: req.body.transferDate,
      items: req.body.items.map((item) => ({
        item: item.product.value,
        qty: item.qty,
      })),
    });

    const sourceBranchStockCounts = await stockCount.findOne({
      branch: sourceBranch,
    });
    items.forEach((element) => {
      const stockCountIndex = sourceBranchStockCounts.items.findIndex(
        (stockCountItem) =>
          stockCountItem.item.toString() === element.product.value
      );
      if (stockCountIndex === -1) {
        sourceBranchStockCounts.items.push({
          item: element.product.value,
          stockQty: element.qty,
        });
      } else {
        sourceBranchStockCounts.items[stockCountIndex].stockQty -= Number(
          element.qty
        );
      }
    });

    const destinationBranchStockCounts = await stockCount.findOne({
      branch: destinationBranch,
    });
    items.forEach((element) => {
      const stockCountIndex = destinationBranchStockCounts.items.findIndex(
        (stockCountItem) =>
          stockCountItem.item.toString() === element.product.value
      );
      if (stockCountIndex === -1) {
        destinationBranchStockCounts.items.push({
          item: element.product.value,
          stockQty: element.qty,
        });
      } else {
        destinationBranchStockCounts.items[stockCountIndex].stockQty += Number(
          element.qty
        );
      }
    });

    Promise.all([
      stockTransferDoc.save(),
      sourceBranchStockCounts.save(),
      destinationBranchStockCounts.save(),
    ]);

    res.status(200).json({ message: "Stock purchased successfully" });
    req.app.io.emit(`reload_${req.user.vendor._id}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while purchasing stock" });
  }
};

const getStockAdjustments = async (req, res, next) => {
  try {
    let result = await stockAdjustment
      .find({ vendor: req.user.vendor._id })
      .sort({ createdAt: -1 })
      .populate("branch")
      .populate({ path: "items.item", model: "inventory" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: e.message });
  }
};

const adjustStock = async (req, res, next) => {
  try {
    const branchId = req.body.branch.value;
    const items = req.body.items;

    const stockAdjustmentDoc = new stockAdjustment({
      vendor: req.user.vendor._id,
      branch: branchId,
      adjustmentDate: req.body.adjustmentDate,
      items: req.body.items.map((item) => ({
        item: item.product.value,
        deltaQty: item.qty,
        reason: item.reason,
      })),
    });

    const stockCounts = await stockCount.findOne({ branch: branchId });

    items.forEach((element) => {
      const stockCountIndex = stockCounts.items.findIndex(
        (stockCountItem) =>
          stockCountItem.item.toString() === element.product.value
      );
      if (stockCountIndex === -1) {
        stockCounts.items.push({
          item: element.product.value,
          stockQty: element.qty,
        });
      } else {
        stockCounts.items[stockCountIndex].stockQty = Number(element.qty);
      }
    });

    Promise.all([stockAdjustmentDoc.save(), stockCounts.save()]);

    res.status(200).json({ message: "Stocks adjusted successfully" });
    req.app.io.emit(`reload_${req.user.vendor._id}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while adjusting stock" });
  }
};

const deleteVendorInventoryItems = async (req, res, next) => {
  try {
    // First we convert the productIds array to an array of ObjectIds
    const inventoryItemIds = req.body.inventoryItemIds.map((_id) =>
      mongoose.Types.ObjectId(_id)
    );

    // Then we delete the Products in the array received from the body
    await inventory.deleteMany({
      _id: { $in: inventoryItemIds.map((item) => item._id) },
    });

    // Then we delete the products which are ingredients in some other products
    // from the Inventory table
    await inventory.updateMany(
      {
        "ingredients.item": { $in: inventoryItemIds },
      },
      {
        $pull: {
          ingredients: { item: { $in: inventoryItemIds } },
        },
      }
    );

    res
      .status(200)
      .json({ message: "Inventory items(s) deleted successfully" });

    req.app.io.emit(`reload_${req.user.vendor._id}`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while deleting inventory items" });
  }
};

module.exports = {
  getAllInventoryItems,
  getBranchInventory,
  getSupplierLinkedItems,
  getStockProductions,
  produceStock,
  getStockPurchasings,
  purchaseStock,
  transferStock,
  getStockTransfers,
  adjustStock,
  getStockAdjustments,
  deleteVendorInventoryItems,
};
