var mongoose = require('mongoose');
var orderSchema = require('../schemas/order.schema');

// orderSchema.statics = {
//     create: async function (data) {
//         var order = new this(data);
//         let result = await order.save();
//         return result;
//     },

//     get: async function (query) {
//         let result = await this.find(query, {
//             _id: 0,
//             orderId: 1,
//             schemaId: 1,
//             customerName: 1,
//             customerMobileNumber: 1,
//             discount: 1,
//             totalAmount: 1,
//             customerId: 1,
//             kitchenId: 1,
//             orderStatus: 1,
//             tax: 1,
//             count:1,
//             orderDetails: 1,
//             preparationTime: 1,
//             paymentType:1,
//             orderPriority:1,
//             orderType:1,
//             chefId: 1,
//             chefName:1,
//             qaId :1,
//             qaName :1,
//             qaTime :1,  
//             orderTypePickup:1,
//             orderTypeDelivery:1,
//             SplitOrderItems:1,
//             splitPayment:1,
//             branch:1,
//             source:1,
//             tableNumber:1,
//             orderInProgressTime:1,
//             createdAt: 1,
//             updatedAt: 1
//         }).sort({ "createdAt": -1 })
//         return result;
//     },
//     getCount: async function (query) {
//         let result = await this.find(query).countDocuments()
//         return result;
//     },
//     getByPagination: async function (query) {
//         var orderStatus = query.orderStatus;
//         let result = await this.find({orderStatus}, {
//             _id: 0,
//             orderId: 1,
//             schemaId: 1,
//             customerName: 1,
//             customerMobileNumber: 1,
//             discount: 1,
//             customerId: 1,
//             totalAmount: 1,
//             count:1,
//             kitchenId: 1,
//             orderStatus: 1,
//             tax: 1,
//             orderDetails: 1,
//             preparationTime: 1,
//             paymentType:1,
//             orderPriority:1,
//             orderType:1,    
//             chefId: 1,
//             chefName:1,
//             qaId :1,
//             qaName :1,
//             qaTime :1,
//             orderTypePickup:1,
//             orderTypeDelivery:1,
//             SplitOrderItems:1,
//             splitPayment:1, 
//             branch:1,
//             source:1,
//             tableNumber:1,
//             orderInProgressTime:1,
//             createdAt: 1,
//             updatedAt: 1
//         }).sort({ "createdAt": -1 }).skip(query.offset).limit(query.perPage)
//         return result;
//     },
//     getOne: async function (query) {
//         let result = await this.findOne(query, {
//             _id: 0,
//             orderId: 1,
//             schemaId: 1,
//             customerName: 1,
//             customerMobileNumber: 1,
//             discount: 1,
//             customerId: 1,
//             totalAmount: 1,
//             kitchenId: 1,
//             orderStatus: 1,
//             tax: 1,
//             orderDetails: 1,
//             count:1,
//             preparationTime: 1,
//             paymentType:1,
//             orderPriority:1,
//             orderType:1,    
//             chefId: 1,
//             chefName:1,
//             qaId :1,
//             qaName :1,
//             qaTime :1,
//             orderTypePickup:1,
//             orderTypeDelivery:1,
//             SplitOrderItems:1,
//             splitPayment:1, 
//             branch:1,
//             source:1,
//             tableNumber:1,
//             orderInProgressTime:1,
//             createdAt: 1,
//             updatedAt: 1
//         });
//         return result;
//     },
//     getById: async function (query) {
//         let result = await this.find(query, {
//             _id: 0,            
//             orderId: 1,
//             schemaId: 1,
//             customerName: 1,
//             customerId: 1,
//             customerMobileNumber: 1, 
//             count:1,           
//             discount: 1,            
//             totalAmount: 1,
//             kitchenId: 1,           
//             orderStatus: 1,
//             tax: 1,
//             orderDetails: 1,
//             preparationTime: 1,
//             paymentType:1,
//             orderPriority:1,
//             orderType:1, 
//             chefId: 1,
//             chefName:1,
//             qaId :1,
//             qaName :1,
//             qaTime :1,
//             orderTypePickup:1,
//             orderTypeDelivery:1,
//             splitOrderItems:1,
//             splitPayment:1,     
//             branch:1,
//             source:1,
//             tableNumber:1,
//             orderInProgressTime:1,
//             createdAt: 1,
//             updatedAt: 1
//         });
//         return result;
//     },
//     updateOne: async function (query, updateData) {
//         let result = await this.findOneAndUpdate(query, { $set: updateData }, { new: true });
//         return result;
//     },
//     delete: async function (query) {
//         let result = await this.findOneAndDelete(query);
//         return result;
//     },
//     deleteOrders: async function (query) {
//         let result = await this.deleteMany(query);
//         return result;
//     },
// }

var orderModel = mongoose.model('orders', orderSchema);
module.exports = orderModel;