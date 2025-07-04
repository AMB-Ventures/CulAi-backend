var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = new Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "brand",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  isSaleable: {
    type: Boolean,
    default: true,
  },
  sellingUom: { type: String, enum: ["unit", "kg", "g", "l", "ml"] },
  sellingPrices: {
    type: {
      defaultSellingPrice: {
        type: Number,
        required: true,
      },
      customSellingPrices: {
        type: Map,
        of: {
          type: {
            branch: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "branch",
              required: true,
            },
            price: { type: Number, required: true },
          },
        },
      },
    },
    required: true,
  },
  taxGroup: {
    type: Schema.Types.ObjectId,
    ref: "taxGroup",
    required: true,
  },
});

module.exports = productSchema;

  // sellingPrices: {
  //   type: Object,
  //   required: true,
  //   default: { default: 0 },
  //   validate: {
  //     validator: function (value) {
  //       if (typeof value !== "object") {
  //         return false;
  //       }
  //       if (typeof value.default !== "number") {
  //         return false;
  //       }
  //       for (const key in value) {
  //         if (key !== "default" && typeof value[key] !== "number") {
  //           return false;
  //         }
  //       }
  //       return true;
  //     },
  //     message: "Invalid selling prices",
  //   },
  // },
  