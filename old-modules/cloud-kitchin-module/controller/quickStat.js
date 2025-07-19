var order = require('../doa/order');
var orderdetails = require('../doa/order-details');
var log = require('../logger');
var datetime = new Date();

exports.getOrders = async (req, res, next) => {
    try {
        if (req.params != null && req.params != undefined) {
            var kitchenId = req.params.kitchenId;

        } else {
            res.json({ "error": "request parameters required" });
        }
        let resp = await order.getStatisticsByStatus(kitchenId);
        if (resp) {
            let accepted = resp["inprogress"] || 0 + resp["qa_inprogress"] || 0 + resp["completed"] || 0 + resp["readyforqa"] || 0;
            let pending = resp["parked"] || 0 + resp["declined"] || 0 + resp["incoming"] || 0;
            let total = accepted + pending;
            res.status(200).json({ totalOrders: total, accepted: accepted, pending: pending, completed: resp["completed"], prepared: resp["completed"], incoming: resp["incoming"] });
        } else {
            res.status(400).json({ error: "data not found" });
        }
    } catch (e) {
        console.log(e)
    }
}

exports.getTotalOrders = async (req, res, next) => {
    try {
        if (req.params != null && req.params != undefined) {
            var kitchenId = req.params.kitchenId;
        } else {
            res.json({ "error": "request parameters required" });
        }
        let result = await order.count({ kitchenId: kitchenId });
        if (result) {
            res.status(200).json({ orders: result });
        } else {
            res.status(400).json({ error: "data not found" });
        }
    } catch (e) {
        console.log(e)
    }
}