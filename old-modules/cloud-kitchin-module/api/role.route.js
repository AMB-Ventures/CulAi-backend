var role = require('../controller/role');

module.exports = function (router) {
    router.put('/role/:kitchenId', role.createRole);
    router.put('/role/:_id/:kitchenId', role.updateRole);
    router.put('/roles/:kitchenId', role.getRoles);
    router.get('/role/:_id/:kitchenId', role.getRoleById);
    router.delete('/role/:_id/:kitchenId', role.deleteRole);
}