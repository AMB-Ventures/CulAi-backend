var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var inventorySchema = new Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor",
      required: true,
    },
    image: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: false,
    },
    preparationTime: {
      type: Number,
    },
    costingMethod: {
      type: String,
      enum: ["fromIngredients", "fromTransactions", "fixed"],
    },
    costPrice: {
      type: String,
      validate: {
        validator: function (value) {
          if (this.costingMethod === "fixed" && !value) {
            return false;
          }
          return true;
        },
        message: "Cost price is required when costing method is set as fixed",
      },
    },
    inventoryUom: { type: String,
       enum: ["unit", "kg", "g", "l", "ml", "mg"] 
      },
    isParLevelActive: { type: Boolean, default: false },
    parLevels: {
      type: {
        defaultParLevel: {
          type: {
            minimumParLevel: { type: Number, required: true },
            maximumParLevel: { type: Number, required: true },
          },
          default: {
            minimumParLevel: 0,
            maximumParLevel: 1,
          },
        },
        customParLevels: [
          {
            branch: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "branch",
              required: true,
            },
            minimumParLevel: { type: Number, required: true },
            maximumParLevel: { type: Number, required: true },
          },
        ],
      },
    },
    barcode: { type: String },
    suppliers: [
      {
        supplier: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "supplier",
        },
        supplierSellingUom: {
          type: String,
          enum: ["unit", "kg", "g", "l", "ml"],
        },
        sellingPrice: {
          type: Number,
          required: false,
        },
        minimumOrderQty: {
          type: Number,
          required: false,
        },
        supplierItemCode: {
          type: String,
          required: false,
        },
      },
    ],
    ingredients: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "inventory",
        },
        qty: { type: Number, required: true },
      },
    ],
    addOns: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "inventory",
        },
        price: { type: Number, required: true },
      },
    ],
    statuses: {
      type: {
        defaultStatus: {
          type: String,
          required: true,
          enum: ["active", "disabled", "outOfStock"],
          default: "active",
        },
        customStatuses: [
          {
            branch: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "branch",
              required: true,
            },
            status: {
              type: String,
              required: true,
              enum: ["active", "disabled", "outOfStock"],
              default: "active",
            },
          },
        ],
      },
    },
  },
  {
    timestamps: true,
    discriminatorKey: "__type",
  }
);

module.exports = inventorySchema;
