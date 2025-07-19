var shift = require('../controller/shift');

module.exports = function (router) {
    router.post('/shift/:kitchenId', shift.createShift);
    router.put('/shift/:_id/:kitchenId', shift.updateShift);
    router.put('/shift/:kitchenId', shift.getShifts);
    router.get('/shift/:_id/:kitchenId', shift.getShiftById);
    router.delete('/shift/:_id/:kitchenId', shift.deleteShift);
    router.patch('/shift/:_id/:kitchenId', shift.updateOnAndOff);
}