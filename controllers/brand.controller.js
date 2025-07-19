var brand = require("../doa/menu/brand.doa");
var category = require("../doa/menu/category.doa");
var product = require("../doa/menu/product.doa");
var inventory = require("../doa/inventory.doa");

const getVendorBrands = async (req, res, next) => {
  try {
    const query = { vendor: req.user.vendor._id };

    if (req.params.status) {
      query.status = "active";
    }

    let result = await brand.getVendorBrands(query);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createVendorBrand = async (req, res, next) => {
  try {
    const data = await brand.createVendorBrands({
      ...req.body,
      vendor: req.user.vendor._id,
      name: req.body.name,
      status: req.body.status.value,
    });
    res
      .status(200)
      .json({ message: "Brand created successfully", brand: data });

    req.app.io.emit(`refetch_brands_${req.user.vendor._id}`);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateBrand = async (req, res, next) => {
  try {
    const updatePayload = {
      name: req.body.name,
      status: req.body.status.value,
    };

    await brand.findByIdAndUpdate(req.params.brandId, updatePayload);
    const updatedBrand = await brand.findById(req.params.brandId);

    res.status(200).json({
      message: "Brand updated successfully",
      brand: updatedBrand,
    });

    req.app.io.emit(`refetch_brands_${req.user.vendor._id}`);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteBrands = async (req, res, next) => {
  try {
    // First we delete the brands in the array received from the body
    // From the Brand table

    const computedBrandIds = req.body.brandIds.map((item) => item) || [];
    await brand.deleteMany({ _id: { $in: computedBrandIds } });

    // Then we fetch the Category Documents/Entries/Rows that are associated with the Brands
    // From the Category table
    const categoryIds = await category.find({
      brand: { $in: computedBrandIds },
    });

    // Then we store just the IDs of the Categories in an array
    const computedCategoryIds = categoryIds.map((item) => item._id) || [];

    // Delete the categories from the category collection
    await category.deleteMany({ _id: { $in: computedCategoryIds } });

    // Then we find the Products Documents/Entries/Rows associated with the Categories
    const productIds = await product.find({
      category: { $in: computedCategoryIds },
    });

    // Store the IDs of the Products in an array
    const computedProductIds = productIds.map((item) => item._id) || [];

    // Delete the Products from the Products collection
    await product.deleteMany({
      _id: { $in: productIds.map((item) => item._id) },
    });

    // Then we delete the Products which are ingredients in some other products
    // from the Inventory table
    await inventory.updateMany(
      {
        "ingredients.item": { $in: computedProductIds },
      },
      {
        $pull: {
          ingredients: { item: { $in: computedProductIds } },
        },
      }
    );

    // req.app.io.emit(`refetch_categories_${req.user.vendor._id}`);
    res
      .status(200)
      .json({
        message: "Brand and it's categories and products deleted successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  updateBrand,
  getVendorBrands,
  createVendorBrand,
  deleteBrands,
};
