var mongoose = require("mongoose");
var inventorySchema = require("../schemas/inventory.schema");

inventorySchema.statics = {
  getVendorInventory: async function (query) {
    let result = await this.find(query)
      .populate("category")
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 });
    return result;
  },
  // createVendorProduct: async function (data) {
  //   var product = new this(data);
  //   let result = await product.save();
  //   return result;
  // },
  // getById: async function (id) {
  //   let result = await this.findById(id)
  //     .populate("brand category taxGroup")
  //   return result;
  // },
};

var inventoryModel = mongoose.model(
  "inventory",
  inventorySchema,
  "inventories"
);
module.exports = inventoryModel;
