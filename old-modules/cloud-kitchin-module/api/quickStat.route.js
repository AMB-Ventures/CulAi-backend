var quickStat = require('../controller/quickStat');
var auth = require('../middlewares/validate-token');


module.exports = function (router) {
    router.get('/totalOrders/:kitchenId', [auth.verifyToken, auth.isKitchenAdmin], quickStat.getOrders);
    router.get('/orders/:kitchenId', [auth.verifyToken, auth.isKitchenAdmin], quickStat.getTotalOrders);
}