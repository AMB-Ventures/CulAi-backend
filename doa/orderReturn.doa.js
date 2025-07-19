var mongoose = require('mongoose');
var orderReturnSchema = require('../schemas/orderReturn.schema');
orderReturnSchema.statics = {
    create: async function (data) {
        var orderReturn = new this(data);
        let result = await orderReturn.save();
        return result;
    }
}

var orderReturnModel = mongoose.model('order-return', orderReturnSchema);
module.exports = orderReturnModel;