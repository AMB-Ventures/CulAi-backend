var stockSchema = require("../schemas/stock.schema");
const inventoryModel = require("./inventory.doa");

stockSchema.statics = {
  getVendorStocks: async function (query) {
    let result = await this.find(query)
      .populate("brand category taxGroup")
      .sort({ createdAt: 1 });
    return result;
  },
  createVendorStock: async function (data) {
    var stock = new this(data);
    let result = await stock.save();
    return result;
  },
  getById: async function (id) {
    let result = await this.findById(id);
    return result;
  },
};

var stockModel = inventoryModel.discriminator("stock", stockSchema);
module.exports = stockModel;
