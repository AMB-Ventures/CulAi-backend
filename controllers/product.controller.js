var mongoose = require("mongoose");
var product = require("../doa/menu/product.doa");
const stockCount = require("../doa/stockCount.doa");
const inventory = require("../doa/inventory.doa");
const xlstojson = require("xls-to-json");
const xlsxtojson = require("xlsx-to-json");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const Brand = require("../doa/menu/brand.doa");
const Category = require("../doa/category.doa");
const TaxGroup = require("../doa/taxGroup.doa");

const getVendorProducts = async (req, res, next) => {
  try {
    let result = await product.getVendorProducts({
      vendor: req.user.vendor._id,
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while fetching products" });
  }
};

const getVendorProductById = async (req, res, next) => {
  try {
    let result = await product
      .findById(req.params.productId)
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
    res.status(500).json({ message: "Error while fetching products" });
  }
};

const getBranchProductsByBrandAndCategory = async (req, res, next) => {
  try {
    const branchId = mongoose.Types.ObjectId(req.user.branch._id);
    const brandId = mongoose.Types.ObjectId(req.params.brandId);
    const categoryId = mongoose.Types.ObjectId(req.params.categoryId);
    const vendorId = mongoose.Types.ObjectId(req.user.vendor._id);

    let result = await product.getVendorProducts({
      brand: brandId,
      category: categoryId,
      vendor: vendorId,
    });

    let plainObjects = result.map((doc) => doc.toObject());

    const branchStockCounts = await stockCount.findOne({
      vendor: vendorId,
      branch: branchId,
    });

    let aggResult = plainObjects
      .filter((obj) => {
        const customStatus = obj.statuses?.customStatuses?.find(
          (csp) => csp.branch.toString() === branchId.toString()
        )?.status;

        if (!customStatus && obj.statuses.defaultStatus !== "disabled")
          return obj;
        else if (!!customStatus && customStatus !== "Disabled") return obj;
      })
      .map((obj) => {
        const sellingPrice =
          obj.sellingPrices.customSellingPrices?.find(
            (csp) => csp.branch.toString() === branchId.toString()
          )?.sellingPrice || obj.sellingPrices.defaultSellingPrice;
        obj.sellingPrice = sellingPrice;

        const parLevels =
          obj.parLevels?.customParLevels?.find(
            (csp) => csp.branch.toString() === branchId.toString()
          ) || obj.parLevels?.defaultParLevel;
        obj.parLevels = parLevels || { minimumParLevel: 0, maximumParLevel: 0 };

        const productStockCount =
          branchStockCounts.items?.find(
            (bsc) => bsc.item.toString() === obj._id.toString()
          )?.stockQty || 0;
        obj.stockQty = productStockCount;

        const customStatus = obj.statuses?.customStatuses?.find(
          (csp) => csp.branch.toString() === branchId.toString()
        )?.status;
        obj.customStatus = customStatus;

        return { ...obj };
      });
    res.status(200).json(aggResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while fetching products" });
  }
};

const createVendorProduct = async (req, res, next) => {
  try {
    if (req.file.size > 500 * 1023) {
      return res.status({ message: "Image Size is larger than 500kb" });
    }
    const imgUrl = req.file.location;
    const data = await product.createVendorProduct({
      image: imgUrl,
      vendor: req.user.vendor._id,
      brand: req.body.brand?.value || req.body.brand || "",
      category: req.body.category?.value || req.body.category || "",
      taxGroup: req.body.taxGroup?.value || req.body.taxGroup || "",
      costingMethod: req.body.costingMethod?.value || req.body.costingMethod,
      name: req.body.name,
      sku: req.body.sku,
      preparationTime: parseInt(req.body.preparationTime) || 0,
      costPrice: parseFloat(req.body.costPrice) || 0,
      barcode: req.body.barcode,
      inventoryUom: req.body.inventoryUom?.value,
      isParLevelActive: req.body.isParLevelActive?.value || false,
      isSaleable: req.body.isSaleable?.value,
      sellingPrices: {
        defaultSellingPrice: parseFloat(req.body.sellingPrice) || 0,
        customSellingPrices: Array.isArray(req.body.customPricings)
          ? req.body.customPricings.map((customP) => ({
              branch: customP.branch.value,
              sellingPrice: parseFloat(customP.sellingPrice) || 0,
            }))
          : [],
      },
      parLevels: {
        defaultParLevel: {
          maximumParLevel: parseFloat(req.body.maximumParLevel) || 0,
          minimumParLevel: parseFloat(req.body.minimumParLevel) || 0,
        },
        customParLevels: (Array.isArray(req.body.customParLevels)
          ? req.body.customParLevels
          : JSON.parse(req.body.customParLevels || "[]")
        ).map((customPL) => ({
          branch: customPL.branch?.value || "",
          minimumParLevel: parseFloat(customPL.minParLevel) || 0,
          maximumParLevel: parseFloat(customPL.maxParLevel) || 0,
        })),
      },
      addOns: (Array.isArray(req.body.addOn)
        ? req.body.addOns
        : JSON.parse(req.body.addOns || "[]")
      ).map((addOn) => ({
        item: addOn.product?.value || "",
        price: parseFloat(addOn.price) || 0,
      })),
      ingredients: (Array.isArray(req.body.ingredients)
        ? req.body.ingredients
        : JSON.parse(req.body.ingredients || "[]")
      ).map((ingredient) => ({
        item: ingredient.product?.value || "",
        qty: ingredient.qty || 0,
      })),
      suppliers: (Array.isArray(req.body.suppliers)
        ? req.body.suppliers
        : JSON.parse(req.body.suppliers || "[]")
      ).map((supplier) => ({
        supplier: supplier.supplier?.value || "",
        supplierSellingUom: supplier.sellingUOM?.value || "",
        sellingPrice: parseFloat(supplier.price) || 0,
        // minimumOrderQty: parseFloat(supplier.minimumOrderQty),
        supplierItemCode: supplier.supplierCode || "",
      })),
      statuses: {
        defaultStatus: req.body.status || "Inactive",
        customStatuses: JSON.parse(req.body.customStatuses || "[]").map(
          (customStatus) => ({
            branch: customStatus.branch?.value || "",
            status: customStatus.status || "Inactive",
          })
        ),
      },
      sellingUom: req.body.sellingUom?.value || req.body.sellingUom || "",
    });

    const newProduct = await product.getById(data._id);

    res.status(200).json({
      message: "Product created successfully",
      product: newProduct,
    });

    req.app.io.emit(`reload_${req.user.vendor._id}`);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateVendorProduct = async (req, res, next) => {
  try {
    const existingProduct = await product.findById(req.params.productId);
    if (!existingProduct) {
      return res.status(400).json({ message: "Product Not found" });
    }

    const imgUrl = req.body.location || existingProduct.image;
    const parseJSON = (data, fallback = []) => {
      try {
        return typeof data === "string"
          ? JSON.parse(data)
          : Array.isArray(data)
          ? data
          : fallback;
      } catch (e) {
        return fallback;
      }
    };
    const validObjectId = (id) => (id && id !== "" ? id : null);
    let updateData = {
      image: imgUrl,
      vendor: req.user.vendor._id,
      brand: validObjectId(req.body.brand?.value || req.body.brand),
      category: validObjectId(req.body.category?.value || req.body.category),
      taxGroup: validObjectId(req.body.taxGroup?.value || req.body.taxGroup),
      costingMethod:
        req.body.costingMethod?.value ||
        req.body.costingMethod ||
        existingProduct.costingMethod,
      name: req.body.name || existingProduct.name,
      sku: req.body.sku || existingProduct.sku,
      preparationTime:
        parseInt(req.body.preparationTime) || existingProduct.preparationTime,
      costPrice: parseFloat(req.body.costPrice) || existingProduct.costPrice,
      barcode: req.body.barcode || existingProduct.barcode,
      inventoryUom:
        req.body.inventoryUom?.value || existingProduct.inventoryUom,
      isParLevelActive:
        req.body.isParLevelActive?.value ?? existingProduct.isParLevelActive,
      isSaleable: req.body.isSaleable?.value ?? existingProduct.isSaleable,

      sellingPrices: {
        defaultSellingPrice:
          parseFloat(req.body.sellingPrice) ||
          existingProduct.sellingPrices.defaultSellingPrice,
        customSellingPrices: parseJSON(req.body.customPricings).map(
          (customP) => ({
            branch: customP.branch?.value || "",
            sellingPrice: parseFloat(customP.sellingPrice) || 0,
          })
        ),
      },

      parLevels: {
        defaultParLevel: {
          maximumParLevel:
            parseFloat(req.body.maximumParLevel) ||
            existingProduct.parLevels.defaultParLevel.maximumParLevel,
          minimumParLevel:
            parseFloat(req.body.minimumParLevel) ||
            existingProduct.parLevels.defaultParLevel.minimumParLevel,
        },
        customParLevels: parseJSON(req.body.customParLevels).map(
          (customPL) => ({
            branch: customPL.branch?.value || "",
            minimumParLevel: parseFloat(customPL.minParLevel) || 0,
            maximumParLevel: parseFloat(customPL.maxParLevel) || 0,
          })
        ),
      },

      addOns: parseJSON(req.body.addOns).map((addOn) => ({
        item: addOn.product?.value || "",
        price: parseFloat(addOn.price) || 0,
      })),

      ingredients: parseJSON(req.body.ingredients).map((ingredient) => ({
        item: ingredient.product?.value || "",
        qty: ingredient.qty || 0,
      })),

      suppliers: parseJSON(req.body.suppliers).map((supplier) => ({
        supplier: supplier.supplier?.value || "",
        supplierSellingUom: supplier.sellingUOM?.value || "",
        sellingPrice: parseFloat(supplier.price) || 0,
        supplierItemCode: supplier.supplierCode || "",
      })),

      statuses: {
        defaultStatus:
          req.body.status || existingProduct.statuses.defaultStatus,
        customStatuses: JSON.parse(req.body.customStatuses || "[]").map(
          (customStatus) => ({
            branch: customStatus.branch?.value || "",
            status:
              customStatus.status || existingProduct.statuses.defaultStatus,
          })
        ),
      },
      sellingUom:
        req.body.sellingUom?.value ||
        req.body.sellingUom ||
        existingProduct.sellingUom,
    };

    await product.findByIdAndUpdate(req.params.productId, updateData);
    const updatedProduct = await product.getById(req.params.productId);

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });

    req.app.io.emit(`reload_${req.user.vendor._id}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVendorProducts = async (req, res, next) => {
  try {
    // First we convert the productIds array to an array of ObjectIds
    const productIds = req.body.productIds.map((_id) =>
      mongoose.Types.ObjectId(_id)
    );

    // Then we delete the Products in the array received from the body
    await product.deleteMany({
      _id: { $in: productIds.map((item) => item._id) },
    });

    // Then we delete the products which are ingredients in some other products
    // from the Inventory table
    await inventory.updateMany(
      {
        "ingredients.item": { $in: productIds },
      },
      {
        $pull: {
          ingredients: { item: { $in: productIds } },
        },
      }
    );

    res.status(200).json({ message: "Product(s) deleted successfully" });

    req.app.io.emit(`reload_${req.user.vendor._id}`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while fetching products" });
  }
};

const importVendorProductsFromExcel = async (req, res, next) => {
  try {
    console.log("Import request received:");
    console.log("Has file:", !!req.file);
    console.log("Body keys:", Object.keys(req.body));
    console.log("Content-Type:", req.headers["content-type"]);

    // Check if this is a JSON request (binary data) instead of file upload
    if (!req.file && req.body && (req.body.fileData || req.body.fileName)) {
      console.log("Processing as binary data...");
      return await importVendorProductsFromBinary(req, res, next);
    }

    // Original file upload logic
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Please upload an Excel or CSV file" });
    }

    // Validate file extension
    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(fileExtension)) {
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message:
          "Invalid file type. Only .xlsx, .xls, and .csv files are allowed.",
      });
    }

    // Check if file was actually uploaded and has content
    if (!req.file.path || !fs.existsSync(req.file.path)) {
      return res.status(400).json({
        message: "File upload failed. Please try again.",
      });
    }

    const fileStats = fs.statSync(req.file.path);
    if (fileStats.size === 0) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: "Uploaded file is empty.",
      });
    }

    let processData;
    if (fileExtension === "csv") {
      // Parse CSV file
      const csvData = fs.readFileSync(req.file.path, "utf8");
      parse(
        csvData,
        { columns: true, trim: true, skip_empty_lines: true },
        async (err, records) => {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          if (err) {
            return res.status(500).json({
              message: "Error processing CSV file",
              error: err.message,
            });
          }
          await handleParsedProductRows(records, req, res);
        }
      );
      return;
    } else {
      // Excel file (.xlsx or .xls)
      let excel2json = fileExtension === "xlsx" ? xlsxtojson : xlstojson;
      const outputFile = Date.now() + ".json";
      excel2json(
        {
          input: req.file.path,
          output: outputFile,
          lowerCaseHeaders: true,
        },
        async function (err, result) {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          if (err) {
            return res.status(500).json({
              message: "Error processing Excel file",
              error: err.message,
            });
          }
          if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
          }
          await handleParsedProductRows(result, req, res);
        }
      );
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error importing products from file",
      error: error.message,
    });
  }
};

const importVendorProductsFromBinary = async (req, res, next) => {
  try {
    console.log("Binary import request received:");
    console.log("Request body keys:", Object.keys(req.body));
    console.log("fileData present:", !!req.body.fileData);
    console.log("fileName:", req.body.fileName);
    console.log("fileType:", req.body.fileType);

    if (!req.body || !req.body.fileData) {
      return res.status(400).json({
        message: "Please provide file data",
        received: {
          bodyKeys: Object.keys(req.body || {}),
          hasFileData: !!req.body?.fileData,
          bodyType: typeof req.body,
        },
      });
    }

    // Extract file data from request body
    const { fileData, fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ message: "Please provide fileName and fileType" });
    }

    // Validate file extension
    const fileExtension = fileName.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(fileExtension)) {
      return res.status(400).json({
        message:
          "Invalid file type. Only .xlsx, .xls, and .csv files are allowed.",
      });
    }

    // Convert base64 to buffer if needed
    let fileBuffer;
    if (typeof fileData === "string") {
      // Remove data URL prefix if present
      const base64Data = fileData.replace(/^data:.*?;base64,/, "");
      fileBuffer = Buffer.from(base64Data, "base64");
    } else if (Buffer.isBuffer(fileData)) {
      fileBuffer = fileData;
    } else {
      return res.status(400).json({ message: "Invalid file data format" });
    }

    // Create temporary file path
    const tempFilePath = path.join(
      __dirname,
      "../uploads",
      `${Date.now()}_${fileName}`
    );

    // Ensure uploads directory exists
    const uploadsDir = path.dirname(tempFilePath);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Write buffer to temporary file
    fs.writeFileSync(tempFilePath, fileBuffer);

    try {
      if (fileExtension === "csv") {
        // Parse CSV file
        const csvData = fs.readFileSync(tempFilePath, "utf8");
        parse(
          csvData,
          { columns: true, trim: true, skip_empty_lines: true },
          async (err, records) => {
            // Clean up temp file
            if (fs.existsSync(tempFilePath)) {
              fs.unlinkSync(tempFilePath);
            }

            if (err) {
              return res.status(500).json({
                message: "Error processing CSV file",
                error: err.message,
              });
            }
            await handleParsedProductRows(records, req, res);
          }
        );
        return;
      } else {
        // Excel file (.xlsx or .xls)
        let excel2json = fileExtension === "xlsx" ? xlsxtojson : xlstojson;
        const outputFile = path.join(
          __dirname,
          "../uploads",
          Date.now() + ".json"
        );

        excel2json(
          {
            input: tempFilePath,
            output: outputFile,
            lowerCaseHeaders: true,
          },
          async function (err, result) {
            // Clean up temp files
            if (fs.existsSync(tempFilePath)) {
              fs.unlinkSync(tempFilePath);
            }
            if (fs.existsSync(outputFile)) {
              fs.unlinkSync(outputFile);
            }

            if (err) {
              return res.status(500).json({
                message: "Error processing Excel file",
                error: err.message,
              });
            }
            await handleParsedProductRows(result, req, res);
          }
        );
        return;
      }
    } catch (processingError) {
      // Clean up temp file on error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      throw processingError;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error importing products from file",
      error: error.message,
    });
  }
};

async function getOrCreateBrand(name, vendorId) {
  let brand = await Brand.findOne({ name: name.trim(), vendor: vendorId });
  if (!brand) {
    brand = await Brand.create({ name: name.trim(), vendor: vendorId });
  }
  return brand._id;
}

async function getOrCreateCategory(name, vendorId) {
  let category = await Category.findOne({
    name: name.trim(),
    vendor: vendorId,
  });
  if (!category) {
    category = await Category.create({ name: name.trim(), vendor: vendorId });
  }
  return category._id;
}

async function getOrCreateTaxGroup(name) {
  let taxGroup = await TaxGroup.findOne({ name: name.trim() });
  if (!taxGroup) {
    taxGroup = await TaxGroup.create({ name: name.trim(), percentage: 0 });
  }
  return taxGroup._id;
}

async function handleParsedProductRows(rows, req, res) {
  try {
    if (!rows || rows.length === 0) {
      return res.status(400).json({ message: "No data found in file" });
    }
    const vendorId = req.user.vendor._id;
    let createdProducts = [];
    const errors = [];
    const validProductsData = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        if (!row.name || !row.brand || !row.category || !row.taxgroup) {
          errors.push(
            `Row ${
              i + 1
            }: Missing required fields (name, brand, category, taxgroup)`
          );
          continue;
        }
        // Lookup or create brand, category, taxGroup
        const brandId = await getOrCreateBrand(row.brand, vendorId);
        const categoryId = await getOrCreateCategory(row.category, vendorId);
        const taxGroupId = await getOrCreateTaxGroup(row.taxgroup);
        const productData = {
          vendor: vendorId,
          name: row.name.trim(),
          sku: row.sku ? row.sku.trim() : "",
          brand: brandId,
          category: categoryId,
          taxGroup: taxGroupId,
          costingMethod: row.costingmethod || "fixed",
          costPrice: row.costprice ? parseFloat(row.costprice) : 0,
          preparationTime: row.preparationtime
            ? parseInt(row.preparationtime)
            : 0,
          barcode: row.barcode ? row.barcode.trim() : "",
          inventoryUom: row.inventoryuom || "unit",
          isParLevelActive:
            row.isparlevelactive === "true" || row.isparlevelactive === true,
          isSaleable: row.issaleable !== "false" && row.issaleable !== false,
          sellingUom: row.sellinguom || "unit",
          sellingPrices: {
            defaultSellingPrice: row.sellingprice
              ? parseFloat(row.sellingprice)
              : 0,
            customSellingPrices: [],
          },
          parLevels: {
            defaultParLevel: {
              minimumParLevel: row.minimumparlevel
                ? parseFloat(row.minimumparlevel)
                : 0,
              maximumParLevel: row.maximumparlevel
                ? parseFloat(row.maximumparlevel)
                : 0,
            },
            customParLevels: [],
          },
          suppliers: [],
          ingredients: [],
          addOns: [],
          statuses: {
            defaultStatus: row.status || "active",
            customStatuses: [],
          },
        };
        validProductsData.push(productData);
      } catch (rowError) {
        errors.push(`Row ${i + 1}: ${rowError.message}`);
      }
    }
    if (validProductsData.length > 0) {
      try {
        createdProducts = await product.createVendorProductsBulk(
          validProductsData
        );
      } catch (bulkError) {
        for (let i = 0; i < validProductsData.length; i++) {
          try {
            const createdProduct = await product.createVendorProduct(
              validProductsData[i]
            );
            createdProducts.push(createdProduct);
          } catch (individualError) {
            errors.push(`Row ${i + 1}: ${individualError.message}`);
          }
        }
      }
    }
    req.app.io.emit(`reload_${vendorId}`);
    res.status(200).json({
      message: "Import completed",
      success: {
        totalProcessed: rows.length,
        created: createdProducts.length,
        products: createdProducts,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing file rows", error: error.message });
  }
}

module.exports = {
  getVendorProducts,
  getVendorProductById,
  getBranchProductsByBrandAndCategory,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProducts,
  importVendorProductsFromExcel,
  importVendorProductsFromBinary,
};
