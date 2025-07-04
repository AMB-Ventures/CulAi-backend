var category = require("../doa/menu/category.doa");
var product = require("../doa/menu/product.doa");
var inventory = require("../doa/inventory.doa");

const createBrandCategory = async (req, res, next) => {
  try {
    const data = await category.createBrandCategory({
      name: req.body.name,
      brand: req.body.brand?.value,
      vendor: req.user.vendor._id,
      station: req.body.station?.value,
    });

    const newCategory = await category.getById(data._id);

    res.status(200).json({
      message: "Category created successfully",
      category: newCategory,
    });

    req.app.io.emit(`refetch_categories_${req.user.vendor._id}`);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateBrandCategory = async (req, res, next) => {
  try {
    const updatePayload = {
      brand: req.body.brand.value,
      name: req.body.name,
      station: req.body.station.value,
      reference: req.body.reference,
    };

    await category.findByIdAndUpdate(req.params.categoryId, updatePayload);
    const updatedCategory = await category.getById(req.params.categoryId);

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });

    req.app.io.emit(`refetch_categories_${req.user.vendor._id}`);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getBrandCategories = async (req, res, next) => {
  try {
    const query = {
      brand: req.params.brandId,
      vendor: req.user.vendor._id,
      status: "active",
    };

    let result = await category.get(query);
    if (result) {
      res.status(200).json(result);
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getVendorCategories = async (req, res, next) => {
  try {
    let result = await category.get({ vendor: req.user.vendor._id });
    if (result) {
      res.status(200).json(result);
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteVendorCategories = async (req, res, next) => {
  try {
    // First we delete the categories from the Category table
    await category.deleteMany({ _id: { $in: req.body.categoryIds } });

    // Then we fetch the Product entries (entire entries/documents) from the Inventory table
    // Here we check if the product belongs to one of the categories in the array from the Body
    // We store the productIds in an array
    const productIds = await product.find({
      category: { $in: req.body.categoryIds },
    });

    // Then we store the IDs of the Products in an array
    const computedProductIds = productIds.map((item) => item._id) || [];

    // Then we delete the products from the Product table
    await product.deleteMany({
      _id: { $in: productIds.map((item) => item._id) },
    });

    // Then we delete the products which are ingredients in some other products
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

    req.app.io.emit(`refetch_categories_${req.user.vendor._id}`);
    res.status(200).json({ message: "Categories deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getBrandCategories,
  createBrandCategory,
  updateBrandCategory,
  getVendorCategories,
  deleteVendorCategories,
};
