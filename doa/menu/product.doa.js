var productSchema = require("../../schemas/menu/product.schema");
const inventoryModel = require("../inventory.doa");

productSchema.statics = {
  getVendorProducts: async function (query) {
    let result = await this.find(query)
      .populate("brand category taxGroup")
      .populate({
        path: "category",
        model: "category",
        populate: {
          path: "station",
          model: "stations",
        },
      })
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 });

    return result;
  },
  createVendorProduct: async function (data) {
    var product = new this(data);
    let result = await product.save();
    return result;
  },
  createVendorProductsBulk: async function (productsData) {
    let result = await this.insertMany(productsData);
    return result;
  },
  getById: async function (id) {
    let result = await this.findById(id)
      .populate("brand category taxGroup")
      .populate({
        path: "station",
        model: "stations",
      });
    return result;
  },
};

var productModel = inventoryModel.discriminator("product", productSchema);
module.exports = productModel;
