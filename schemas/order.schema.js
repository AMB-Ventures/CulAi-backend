const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const taxGroupModel = require("../doa/taxGroup.doa");

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      unique: true,
      index: true,
    },
    vendor: { type: Object },
    branch: { type: Object },
    cashier: { type: Object },
    customer: { type: Object },

    totalAmount: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    taxGroup: taxGroupModel.schema,
    declineReason: { type: String },
    preparationTime: {
      type: Number,
    },
    paymentType: { type: String },
    orderPriority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    orderType: {
      type: String,
      enum: ["dinein", "pickup", "delivery"],
      required: true,
    },
    typeOfOrderType: {
      type: String,
      enum: ["bySelf", "byApplication"],
    },
    riderNumber: { type: String },
    reference: { type: String },
    application: { type: String },

    splitByPayment: {
      type: [
        {
          amount: { type: Number },
          type: {
            type: String,
            enum: ["card", "cash"],
          },
        },
      ],
    },
    splitByOrderItems: {
      type: [
        {
          products: [{ type: Object }],
          type: {
            type: String,
            enum: ["card", "cash"],
          },
        },
      ],
    },
    orderItems: {
      type: [
        {
          product: { type: Object },
          qty: { type: Number },
          status: { type: String },
          rejections: {
            type: [
              {
                reason: String,
                rejectedAt: Date,
                rejectedBy: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "user",
                },
              },
            ],
            default: [],
          },
          chef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
          chefStatus: {
            type: String,
            enum: ["pending", "accepted", "completed", "served"],
            default: "pending",
          },
          chefAcceptedAt: { type: Date },
          chefCompletedAt: { type: Date },
          chefTotalPreparationTime: { type: Number },
          completedAt: { type: Date },
          declinedAt: { type: Date },
        },
      ],
      required: true,
    },
    cookingInstructions: { type: String },
    status: {
      type: String,
      default: "created",
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    declinedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    declinedAt: { type: Date },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    cancelledAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", function (next) {
  if (!this.orderId) this.orderId = uuidv4();
  next();
});

module.exports = orderSchema;
