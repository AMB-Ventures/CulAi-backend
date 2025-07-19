var mongoose = require('mongoose');
var orderDetailsSchema = require('../model/order-details');
orderDetailsSchema.statics = {
    create: async function (data) {
        var orderDetail = new this(data);
        let result = await orderDetail.save();
        return result;
    },

    get: async function (query) {
        let result = await this.find(query, {
            _id: 0,
            itemId: 1,
            schemaId: 1,
            orderId: 1,
            kitchenId: 1,
            chefId: 1,
            // qaId: 1,
            itemStatus: 1,
            count: 1,
            price: 1,
            menuName: 1,
            menuImage: 1,
            menuId: 1,
            vendorLogo: 1,
            cookingInstruction: 1,
            size: 1,
            preparationTime: 1,
            // timestamps: 1
            createdAt: 1,
            updatedAt: 1
        }).sort({ "createdAt": -1 })
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, {
            _id: 0,
            itemId: 1,
            schemaId: 1,
            orderId: 1,
            kitchenId: 1,
            chefId: 1,
            // qaId: 1,
            itemStatus: 1,
            count: 1,
            price: 1,
            menuName: 1,
            menuImage: 1,
            menuId: 1,
            vendorLogo: 1,
            cookingInstruction: 1,
            size: 1,
            preparationTime: 1,
            // timestamps: 1
            createdAt: 1,
            updatedAt: 1
        });
        return result;
    },
    getById: async function (query) {
        let result = await this.find(query, {
            _id: 0,
            itemId: 1,
            schemaId: 1,
            orderId: 1,
            kitchenId: 1,
            chefId: 1,
            // qaId: 1,
            itemStatus: 1,
            count: 1,
            price: 1,
            menuName: 1,
            menuImage: 1,
            menuId: 1,
            vendorLogo: 1,
            cookingInstruction: 1,
            size: 1,
            preparationTime: 1,
            // timestamps: 1
            createdAt: 1,
            updatedAt: 1
        });
        return result;
    },
    update: async function (query, updateData) {
        let result = await this.findOneAndUpdate(query, { $set: updateData }, { new: true });
        return result;
    },
    delete: async function (query) {
        let result = await this.findOneAndDelete(query);
        return result;
    },
    deleteM: async function (query) {
        let result = await this.deleteMany(query);
        return result;
    }
}

var orderDetailsModel = mongoose.model('order_details', orderDetailsSchema);
module.exports = orderDetailsModel;