var order = require("../controller/order");
// var auth = require('../middlewares/validate-token');
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const requestSchemaForOrder = Joi.object().keys({
  orderId: Joi.string().required(),
  customerName: Joi.string().required(),
  customerMobileNumber: Joi.string().required(),
  vendorName: Joi.string().required(),
  merchantId: Joi.string().required(),
  discount: Joi.number().required(),
  totalAmount: Joi.number().required(),
  tax: Joi.number().required(),
  orderDetails: Joi.array().items({
    count: Joi.number().required(),
    price: Joi.number().required(),
    menuId: Joi.number().required(),
    cookingInstruction: Joi.string().required(),
    size: Joi.string().required(),
  }),
});

module.exports = function (router) {
  router.post(
    "/order",
    validator.body(requestSchemaForOrder),
    order.saveAndSendOrder
  );

  // API to delete all orders
  router.delete("/delete-orders/:kitchenId", order.deleteAllOrders);
};
