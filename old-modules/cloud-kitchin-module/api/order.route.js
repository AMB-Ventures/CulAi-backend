var order = require('../controller/order');
var auth = require('../middlewares/validate-token');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});



module.exports = function (router) {
    router.get('/:kitchenId/user/:userId/orders', [auth.verifyToken, auth.isAdminReceptionist], order.getOrders);
    router.get('/:kitchenId/user/:userId/order/:orderId', [auth.verifyToken, auth.isKitchenAdmin], order.getOrderDetails);
    router.patch('/:kitchenId/user/:userId/order/:orderId/item/:itemId', [auth.verifyToken, auth.isKitchenAdmin], order.assignOrderItems);
    router.patch('/:kitchenId/user/:userId/order/:orderId', [auth.verifyToken, auth.isKitchenAdmin], order.updateOrderStatus);
    router.patch('/:kitchenId/order/:orderId/item/:itemId', [auth.verifyToken, auth.isChef], order.updateItemStatus);
    router.patch('/:kitchenId/user/:userId/order/:orderId/decline', [auth.verifyToken, auth.isKitchenAdmin], order.declineOrder);
    router.patch('/:kitchenId/item/:itemId/order/:orderId/declineitem', [auth.verifyToken, auth.isChef], order.declineItem);
    router.get('/chef/:chefId', [auth.verifyToken, auth.isChef], order.getOrderByChef);
    router.get('/qa/:qaId', [auth.verifyToken, auth.isQA], order.getOrderByQa);
    router.patch('/:kitchenId/order/:orderId/item/:itemId/qa', [auth.verifyToken, auth.isQA], order.updateItemStatus);
    router.get('/order/:orderId', [auth.verifyToken, auth.isQA], order.completeOrderStatus);
    router.patch('/:kitchenId/order/:orderId', [auth.verifyToken, auth.isKitchenAdmin], order.assignOrders);
    router.patch('/:kitchenId/order/:orderId/qa', [auth.verifyToken, auth.isQA], order.updateOrderStatus);
    router.get('/:kitchenId/qa/order/:orderId', [auth.verifyToken, auth.isQA], order.getOrderDetails);
    router.get('/:kitchenId/user/:userId/orders', [auth.verifyToken, auth.isKitchenAdmin], order.getOrders);
    router.get('/:kitchenId/orderdetails/:orderId', order.getSeletedOrderDetails);
    router.get('/kitchens/:vendorId', order.getKitchenByVendorId);
    // router.get('/:kitchenId/user/:userId/menu/:menuId', menu.getMenuById);
    // router.patch('/:kitchenId/user/:userId/menu/:menuId/available-status', menu.updateAvailable);
    // router.put('/:kitchenId/chef/:chefId/qa/:qaId/order/:orderId', order.updateChefOrderStatus);
}