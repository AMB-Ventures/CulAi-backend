const mongoose = require("mongoose");
const brandSchema = require("../../schemas/menu/brand.schema");

brandSchema.statics = {
  createVendorBrands: async function (data) {
    var brand = new this(data);
    let result = await brand.save();
    return result;
  },
  getVendorBrands: async function (query) {
    let result = await this.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 });
    return result;
  },
};

const brandModel = mongoose.model("brand", brandSchema);
module.exports = brandModel;
