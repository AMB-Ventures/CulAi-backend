var stock = require("../doa/stock.doa");
var mongoose = require("mongoose");
var inventory = require("../doa/inventory.doa");
const stockCount = require("../doa/stockCount.doa");

const getVendorStocks = async (req, res, next) => {
  try {
    let result = await inventory.getVendorStocks({
      vendor: req.user.vendor._id,
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while fetching Stocks" });
  }
};

const getVendorStockById = async (req, res, next) => {
  try {
    let result = await inventory
      .findById(req.params.stockId)
      .populate("vendor brand category taxGroup")
      .populate({
        path: "suppliers.supplier",
        model: "suppliers",
      })
      .populate({
        path: "sellingPrices.customSellingPrices.branch",
        model: "branch",
      })
      .populate({
        path: "statuses.customStatuses.branch",
        model: "branch",
      })
      .populate({
        path: "addOns.item",
        model: "inventory",
      })
      .populate({
        path: "ingredients.item",
        model: "inventory",
      })
      .populate({
        path: "ingredients.item",
        model: "inventory",
      })
      .populate({
        path: "parLevels.customParLevels.branch",
        model: "branch",
      });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while fetching Stocks" });
  }
};

const getBranchStocksByBrandAndCategory = async (req, res, next) => {
  try {
    let result = await stock.getVendorStocks({
      brand: req.params.brandId,
      category: req.params.categoryId,
      vendor: req.user.vendor._id,
    });

    let plainObjects = result.map((doc) => doc.toObject());

    const branchStockCounts = await stockCount.findOne({
      vendor: req.user.vendor._id,
      branch: req.user.branch._id,
    });

    let aggResult = plainObjects.map((obj) => {
      obj.sellingPrice = obj.sellingPrices.defaultSellingPrice;
      delete obj.sellingPrices;

      const StockstockCount =
        branchStockCounts.items?.find(
          (bsc) => bsc.item.toString() === obj._id.toString()
        )?.stockQty || 0;

      obj.stockQty = StockstockCount;

      return { ...obj };
    });
    res.status(200).json(aggResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while fetching Stocks" });
  }
};

const createVendorStock = async (req, res, next) => {
  try {
    
    const data = await stock.createVendorStock({
      vendor: req.user.vendor._id,
      name: req.body.name,
      sku: req.body.sku,
      barcode: req.body.barcode,
      // costingMethod: req.body.costingMethod?.value || req.body.costingMethod,
      inventoryUom: req.body.inventoryUom?.value || req.body.inventoryUom || '',
      isParLevelActive: req.body.isParLevelActive?.value || false,
      parLevels: {
        defaultParLevel: {
          maximumParLevel: parseFloat(req.body.maximumParLevel) || 0,
          minimumParLevel: parseFloat(req.body.minimumParLevel) || 0,
        },
        customParLevels: (Array.isArray(req.body.customParLevels) 
          ? req.body.customParLevels 
          : JSON.parse(req.body.customParLevels || "[]")).map((customPL) => ({
          branch: customPL.branch?.value || "",
          minimumParLevel: parseFloat(customPL.minParLevel) || 0,
          maximumParLevel: parseFloat(customPL.maxParLevel) || 0,
        })),
      },
      ingredients: (Array.isArray(req.body.ingredients) 
      ? req.body.ingredients: JSON.parse(req.body.ingredients || "[]")).map((ingredient) => ({
        item: ingredient.stock?.value || ingredient.stock || "",
        qty: parseFloat(ingredient.qty) || 0,
      })),
      suppliers: (Array.isArray(req.body.suppliers)
        ? req.body.suppliers
        : JSON.parse(req.body.suppliers || "[]")
      ).map((supplier) => ({
        supplier: supplier.supplier?.value || supplier.supplier || "",
        supplierSellingUom: supplier.sellingUOM?.value || supplier.sellingUOM || "",
        sellingPrice: parseFloat(supplier.price)|| 0,
        supplierItemCode: supplier.supplierCode|| "",
      })),
      statuses: {
        defaultStatus: req.body.status?.value || req.body.status || "Inactive",
        customStatuses: (Array.isArray(req.body.customStatuses)? 
        req.body.customStatuses :
         JSON.parse(req.body.customStatuses || "[]")).map((customStatus) => ({
          branch: customStatus.branch?.value || customStatus.branch || "",
          status: customStatus.status?.value || customStatus.status || "Inactive",
        })),
      },      
    });

    const newStock = await stock.getById(data._id);

    res.status(200).json({
      message: "stock created successfully",
      stock: newStock,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateVendorStock = async (req, res, next) => {
  try {
    const { stockId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(stockId)) {
      return res.status(400).json({ message: 'Invalid stock ID' });
    }

    const existingStock = await inventory.findById(stockId);
    if (!existingStock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const updateData = {};

    // Only include fields present in req.body to avoid overwriting with old data
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.sku !== undefined) updateData.sku = req.body.sku;
    if (req.body.barcode !== undefined) updateData.barcode = req.body.barcode;
    if (req.body.inventoryUom?.value) updateData.inventoryUom = req.body.inventoryUom.value;
    if (req.body.inventoryUom !== undefined) {
      updateData.inventoryUom = req.body.inventoryUom.value ? req.body.inventoryUom.value : req.body.inventoryUom;
    }
    if (req.body.isParLevelActive?.value !== undefined) updateData.isParLevelActive = req.body.isParLevelActive.value;

    // Handle parLevels
    if (
      req.body.maximumParLevel !== undefined ||
      req.body.minimumParLevel !== undefined ||
      req.body.customParLevels !== undefined
    ) {
      updateData.parLevels = {
        defaultParLevel: {
          maximumParLevel:
            parseFloat(req.body.maximumParLevel) || existingStock.parLevels?.defaultParLevel?.maximumParLevel || 0,
          minimumParLevel:
            parseFloat(req.body.minimumParLevel) || existingStock.parLevels?.defaultParLevel?.minimumParLevel || 0,
        },
        customParLevels: (Array.isArray(req.body.customParLevels)
          ? req.body.customParLevels
          : JSON.parse(req.body.customParLevels || '[]')
        ).map((customPL) => ({
          branch: customPL.branch?.value || customPL.branch || '',
          minimumParLevel: parseFloat(customPL.minParLevel) || 0,
          maximumParLevel: parseFloat(customPL.maxParLevel) || 0,
        })),
      };
    }

    // Handle ingredients
    if (req.body.ingredients !== undefined) {
      updateData.ingredients = (Array.isArray(req.body.ingredients)
        ? req.body.ingredients
        : JSON.parse(req.body.ingredients || '[]')
      ).map((ingredient) => ({
        item: ingredient.stock?.value || ingredient.stock || '',
        qty: parseFloat(ingredient.qty) || 0,
      }));
    }

    // Handle suppliers
    if (req.body.suppliers !== undefined) {
      updateData.suppliers = (Array.isArray(req.body.suppliers)
        ? req.body.suppliers
        : JSON.parse(req.body.suppliers || '[]')
      ).map((supplier) => ({
        supplier: supplier.supplier?.value || supplier.supplier || '',
        supplierSellingUom: supplier.sellingUOM?.value || supplier.sellingUOM || '',
        sellingPrice: parseFloat(supplier.price) || 0,
        supplierItemCode: supplier.supplierCode || '',
      }));
    }

    // Handle statuses
    if (req.body.status?.value || req.body.customStatuses !== undefined) {
      updateData.statuses = {
        defaultStatus: req.body.status?.value || existingStock.statuses?.defaultStatus || 'Inactive',
        customStatuses: (Array.isArray(req.body.customStatuses)
          ? req.body.customStatuses
          : JSON.parse(req.body.customStatuses || '[]')
        ).map((customStatus) => ({
          branch: customStatus.branch?.value || customStatus.branch || '',
          status: customStatus.status?.value || customStatus.status || 'Inactive',
        })),
      };
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    const updatedStock = await inventory.findByIdAndUpdate(stockId, { $set: updateData }, { new: true });
    if (!updatedStock) {
      return res.status(404).json({ message: 'Stock not found after update' });
    }

    res.status(200).json({
      message: 'Stock updated successfully',
      stock: updatedStock,
    });

    if (req.app.io && req.user?.vendor?._id) {
      req.app.io.emit(`reload_${req.user.vendor._id}`);
    }
  } catch (error) {
    console.error('Error in updateVendorStock:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const deleteVendorStocks = async (req, res, next) => {
  try {
    const { brandId, categoryId } = req.params;
    const deletionResult = await inventory.deleteMany({
      brand: brandId,
      category: categoryId,
    });
    if (deletionResult.deletedCount === 0) {
      return res.status(404).json({ message: 'No stocks found for the given criteria' });
    }
    res.status(200).json({
      message: 'Stocks deleted successfully',
      deletedCount: deletionResult.deletedCount,
    });
  } catch (err) {
    console.error('Error while deleting stocks:', err);
    res.status(500).json({ message: 'Error while deleting stocks', error: err.message });
  }
};


module.exports = {
  getVendorStocks,
  getVendorStockById,
  getBranchStocksByBrandAndCategory,
  createVendorStock,
  updateVendorStock,
  deleteVendorStocks,
};
