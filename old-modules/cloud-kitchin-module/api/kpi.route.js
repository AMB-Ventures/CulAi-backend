var kpi = require('../controller/kpi');
var auth = require('../middlewares/validate-token');


module.exports = function (router) {
    router.get('/getkpis/:kitchenId/menu/:menuId/start/:start/end/:end', kpi.getkpis);
    router.get('/getqarejectedmenuitemkpis/:kitchenId/start/:start/end/:end', kpi.getQARejectedMenuItemkpis);
    router.get('/kpis_menuCount/:kitchenId/start/:start/end/:end', kpi.menuCount);
    router.get('/kpis_menuAverageTime/:kitchenId/start/:start/end/:end', kpi.menuAverageTime);
    // router.get('/kpis_orderCount/:kitchenId/:orderId/start/:start/end/:end', kpi.orderDetails);
    router.get('/orderreport/:kitchenId/order/:orderId', kpi.getOrders);
    router.get('/orderdetailsreport/:kitchenId/:start/:end', kpi.getOrdersData);
    router.get('/failingKpi/:kitchenId/start/:start/end/:end', kpi.failingKpi);
}