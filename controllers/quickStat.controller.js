var order = require('../doa/order.doa');
var orderdetails = require('../doa/orderDetails.doa');
var log = require('../logger');
var datetime = new Date();

exports.getOrders = async (req, res, next) => {
    try {
        if (req.params != null && req.params != undefined) {
            var kitchenId = req.params.kitchenId;

        } else {
            res.json({ "error": "request parameters required" });
        }

        let totalOrders = await order.count({ kitchenId: kitchenId });
        let inprogress = await order.count({ kitchenId: kitchenId, orderStatus: "inprogress" });
        let parked = await order.count({ kitchenId: kitchenId, orderStatus: "parked" });
        let declined = await order.count({ kitchenId: kitchenId, orderStatus: "declined" });
        let completed = await order.count({ kitchenId: kitchenId, orderStatus: "completed" });
        let incoming = await order.count({ kitchenId: kitchenId, orderStatus: "incoming" });
        let readyForQA = await order.count({ kitchenId: kitchenId, orderStatus: "readyforqa" });
        let QA_inprogress = await order.count({ kitchenId: kitchenId, orderStatus: "qa_inprogress" });

        let accepted = inprogress + QA_inprogress + completed + readyForQA;
        let pending = parked + declined + incoming;
        let total = accepted + pending;
        // console.log(inprogress, parked, declined, QA_inprogress, completed, readyForQA)
        log.info(datetime + " === " + "success");
        res.status(200).json({ totalOrders: total, accepted: accepted, pending: pending, completed: completed, prepared: completed, incoming: incoming });
    } catch (e) {
        console.log(e)
    }
}

exports.getTotalOrders = async (req, res, next) => {
    try {
        if (req.params != null && req.params != undefined) {
            var kitchenId = req.params.kitchenId;
            // var orderStatus = req.body.orderStatus;
            // var orderId = req.params.orderId;
        } else {
            res.json({ "error": "request parameters required" });
        }
        let result = await order.count({ kitchenId: kitchenId });
        if (result) {
            log.info(datetime + " === " + "success");
            res.status(200).json({ orders: result });
        } else {
            log.error(datetime + " === " + result);
            res.status(400).json({ error: "data not found" });
        }
    } catch (e) {
        console.log(e)
    }
}
