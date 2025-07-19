var mongoose = require("mongoose");
var orderSchema = require("../model/order");
orderSchema.statics = {
  create: async function (data) {
    var order = new this(data);
    let result = await order.save();
    return result;
  },

  get: async function (query) {
    let result = await this.find(query, {
      _id: 0,
      schemaId: 1,
      orderId: 1,
      customerName: 1,
      customerMobileNumber: 1,
      vendorId: 1,
      vendorName: 1,
      vendorLogo: 1,
      merchantName: 1,
      merchantId: 1,
      merchantLogo: 1,
      discount: 1,
      // timestamp: 1,
      totalAmount: 1,
      kitchenId: 1,
      qaId: 1,
      qaName: 1,
      orderStatus: 1,
      tax: 1,
      orderDetails: 1,
      preparationTime: 1,
      qaTime: 1,
      createdAt: 1,
      updatedAt: 1,
    });
    return result;
  },
  getOne: async function (query) {
    let result = await this.findOne(query, {
      _id: 0,
      schemaId: 1,
      orderId: 1,
      customerName: 1,
      customerMobileNumber: 1,
      vendorId: 1,
      vendorName: 1,
      vendorLogo: 1,
      merchantName: 1,
      merchantId: 1,
      merchantLogo: 1,
      discount: 1,
      // timestamp: 1,
      totalAmount: 1,
      kitchenId: 1,
      qaId: 1,
      qaName: 1,
      orderStatus: 1,
      tax: 1,
      orderDetails: 1,
      preparationTime: 1,
      qaTime: 1,
      createdAt: 1,
      updatedAt: 1,
    });
    return result;
  },
  getById: async function (query) {
    let result = await this.find(query, {
      _id: 0,
      schemaId: 1,
      orderId: 1,
      customerName: 1,
      customerMobileNumber: 1,
      vendorId: 1,
      vendorName: 1,
      vendorLogo: 1,
      merchantName: 1,
      merchantId: 1,
      merchantLogo: 1,
      discount: 1,
      // timestamp: 1,
      totalAmount: 1,
      kitchenId: 1,
      qaId: 1,
      qaName: 1,
      orderStatus: 1,
      tax: 1,
      orderDetails: 1,
      preprationTime: 1,
      qaTime: 1,
      createdAt: 1,
      updatedAt: 1,
    });
    return result;
  },
  update: async function (query, updateData) {
    let result = await this.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true }
    );
    return result;
  },
  delete: async function (query) {
    let result = await this.findOneAndDelete(query);
    return result;
  },
  deleteOrders: async function (query) {
    let result = await this.deleteMany(query);
    return result;
  },
};

var orderModel = mongoose.model("orders", orderSchema);
module.exports = orderModel;
