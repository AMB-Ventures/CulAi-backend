var order = require('../doa/order');
var cloudKitchen = require('../doa/cloud_kitchen');
var orderdetails = require('../doa/order-details');
var employee = require('../doa/employee');
var log = require('../logger');
var datetime = new Date();
const Pusher = require("pusher");
global.pusher = new Pusher({
    appId: process.env.pusherAppId,
    key: process.env.pusherKey,
    secret: process.env.pusherSecret,
    cluster: "ap2",
    useTLS: true
});

//create Kitchenconfig

//get all the Kitchenconfig's details present
exports.getOrders = async (req, res, next) => {
    try {
        if (req.params != null && req.params != undefined) {
            var kitchenId = req.params.kitchenId;
            // var userId = req.params.userId;
        } else {
            res.json({ "error": "request parameters required" });
        }
        let result = await order.get({ kitchenId });
        if (result) {
            res.status(200).json({ orders: result });
        } else {
            res.status(400).json({ error: "data not found" });
        }
    } catch (e) {
        console.log(e)
    }
}

exports.getOrderDetails = async (req, res, next) => {
    try {
        if (req.params != null && req.params != undefined) {
            var kitchenId = req.params.kitchenId;
            // var userId = req.params.userId;
            var orderId = req.params.orderId;
        } else {
            res.json({ "error": "request parameters required" });
        }
        let result = await orderdetails.get({ kitchenId: kitchenId, orderId: orderId });
        if (result) {
            res.status(200).json({ "orderDetails": result });
        } else {
            res.status(400).json({ error: "data not found" });
        }
    } catch (e) {
        console.log(e)
    }
}

exports.getSeletedOrderDetails = async (req, res, next) => {
    try {
        if (req.params != null && req.params != undefined) {
            var kitchenId = req.params.kitchenId;
            // var userId = req.params.userId;
            var orderId = req.params.orderId;
        } else {
            res.json({ "error": "request parameters required" });
        }
        let result = await orderdetails.getSelected({ kitchenId: kitchenId, orderId: orderId });
        if (result) {
            res.status(200).json({ "orderDetails": result });
        } else {
            res.status(400).json({ error: "data not found" });
        }
    } catch (e) {
        console.log(e)
    }
}

//update order detail
exports.assignOrderItems = async (req, res, next) => {
    try {
        if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
            var kitchenId = parseInt(req.params.kitchenId);
            // var userId = parseInt(req.params.userId);
            var orderId = req.params.orderId
            var itemId = req.params.itemId;
        } else {
            res.status(400).json({ "error": "request parameters required" });
        }
        let orderDetailsData = await orderdetails.getOne({ kitchenId: kitchenId, orderId: orderId, itemId: itemId });
        if (orderDetailsData) {
            if (req.body !== null && req.body !== undefined) {
                let emp = await employee.getOne({ "employeeId": req.body.chefId });
                // console.log(emp);
                var orderDetailsItem = {
                    chefId: req.body.chefId,
                    itemStatus: 'incoming',
                    chefName: emp.Name
                }
                log.info("Updating orderDetails ===== ");
                let result = await orderdetails.update({ "itemId": itemId }, orderDetailsItem);
                if (result) {
                    res.status(200).json({ message: "order item updated successfully" });
                } else {
                    res.status(500).json({ error: "can't update order item" });
                }
            } else {
                res.status(400).json({ "error": "request body required" });
            }
        } else {
            res.status(400).json({ "error": "item not found" });
        }
    } catch (e) {
        console.log(e)
    }

}

exports.updateOrderStatus = async (req, res, next) => {
    try {
        if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
            var kitchenId = parseInt(req.params.kitchenId);
            // var userId = parseInt(req.params.userId);
            var orderId = req.params.orderId
        } else {
            res.status(400).json({ "error": "request parameters required" });
        }
        let orderData = await order.getOne({ kitchenId: kitchenId, orderId: orderId });
        if (orderData) {
            if (req.body !== null && req.body !== undefined) {
                var orderObj = {
                    orderStatus: req.body.orderStatus
                }
                log.info("Updating order status ===== ");
                let result = await order.update({ "orderId": orderId }, orderObj);
                if (result) {
                    // if ()
                    log.info(datetime + " === " + result);
                    res.status(200).json({ message: "order status updated successfully" });
                    var data = {
                        kitchenId: parseInt(req.params.kitchenId),
                        orderId: result.orderId,
                        orderStatus: result.orderStatus,
                        mode: "order",
                        userIds: [result.qaId],
                        roles: ['kitchen_admin', 'receptionist', 'chef', 'qa']
                    }
                    let orderDetailsTemp = await orderdetails.get({ orderId: result.orderId });
                    if (orderDetailsTemp.length > 0) orderDetailsTemp.map(u => { data.userIds.push(u.chefId); });
                    global.pusher.trigger("order", "incoming", {
                        message: JSON.stringify(data)
                    }).then(console.log).catch(e => console.log(e));

                } else {
                    res.status(500).json({ error: "can't update order status" });
                }
            } else {
                res.status(400).json({ "error": "request body required" });
            }
        } else {
            res.status(400).json({ "error": "item not found" });
        }
    } catch (e) {
        console.log(e)
    }
}

exports.declineOrder = async (req, res, next) => {
    try {
        if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
            var kitchenId = parseInt(req.params.kitchenId);
            // var userId = parseInt(req.params.userId);
            var orderId = req.params.orderId
        } else {
            res.status(400).json({ "error": "request parameters required" });
        }
        let orderData = await order.getOne({ kitchenId: kitchenId, orderId: orderId });
        if (orderData) {
            if (req.body !== null && req.body !== undefined) {
                var orderObj = {
                    declineReason: req.body.declineReason,
                    orderStatus: 'declined'
                }
                log.info("Updating order status ===== ");
                let result = await order.update({ "orderId": orderId }, orderObj);
                if (result) {
                    log.info(datetime + " === " + result);
                    res.status(200).json({ message: "order declined successfully" });
                    var data = {
                        kitchenId: parseInt(req.params.kitchenId),
                        orderId: result.orderId,
                        orderStatus: result.orderStatus,
                        mode: "order",
                        roles: ['kitchen_admin']
                    }
                    global.pusher.trigger("order", "incoming", {
                        message: JSON.stringify(data)
                    }).then(console.log).catch(e => console.log(e));
                } else {
                    res.status(500).json({ error: "can't decline order status" });
                }
            } else {
                res.status(400).json({ "error": "request body required" });
            }
        } else {
            res.status(400).json({ "error": "item not found" });
        }
    } catch (e) {
        console.log(e)
    }

}

exports.getOrderByChef = async (req, res, next) => {
    try {
        if (req.params != null && req.params != undefined) {

            var chefId = req.params.chefId;
        } else {
            res.json({ "error": "request parameters required" });
        }
        let result = await orderdetails.get({ chefId: chefId });
        if (result) {
            res.status(200).json({ "orderDetails": result });
        } else {
            res.status(400).json({ error: "data not found" });
        }
    } catch (e) {
        console.log(e)
    }
}

exports.updateItemStatus = async (req, res, next) => {
    try {
        if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
            var kitchenId = parseInt(req.params.kitchenId);
            var itemId = req.params.itemId;
            var orderId = req.params.orderId;
        } else {
            res.status(400).json({ "error": "request parameters required" });
        }
        let orderData = await orderdetails.get({ kitchenId: kitchenId, orderId: orderId, itemId: itemId });
        if (orderData) {
            if (req.body !== null && req.body !== undefined) {
                var orderObj = {
                    itemStatus: req.body.itemStatus,
                    completedTime: req.body.completedTime,
                    description: req.body.description,
                    rejectedByQa: req.body.rejectedByQa == null || req.body.rejectedByQa == undefined ? false : req.body.rejectedByQa
                };
                // console.log("the des. value is " + orderObj.description);
                log.info("Updating item status ===== ");
                let result = await orderdetails.update({ "orderId": orderId, "itemId": itemId }, orderObj);
                if (result) {
                    // console.log(result);
                    let orders = await order.findOne({ "orderId": result.orderId });
                    if (result.itemStatus == "inprogress") {

                        // console.log(orders);
                        if (orders.orderStatus == "incoming") {
                            var statusObj = {
                                orderStatus: "inprogress"
                            }
                            var newData = await order.update({ "orderId": result.orderId }, statusObj);
                            console.log(newData.orderStatus);
                            res.status(200).json({ message: "Item status updated successfully" });
                        }else{
                            res.status(200).json({ message: "Item status updated successfully" });
                        }
                    } else {
                        let resultNew = await orderdetails.get({ "orderId": orderId });
                        if (resultNew.filter(d => d.itemStatus == 'approved').length === resultNew.length) {
                            var statusObj = {
                                orderStatus: "readyfordelivery"
                            }
                            var newData = await order.update({ "orderId": orderId }, statusObj);
                            // console.log(newData.orderStatus);

                            res.status(200).json({ message: "Item status updated successfully" });

                        } else if (resultNew.filter(d => d.itemStatus == 'readyforqa').length === resultNew.length) {
                            var statusObj = {
                                orderStatus: "readyforqa",
                            }

                            var newData = await order.update({ "orderId": orderId }, statusObj);
                            // console.log(newData.orderStatus)
                            res.status(200).json({ message: "Item status updated successfully" });

                        } else {
                            res.status(200).json({ message: "all items are  not verified" });
                        }
                    }
                    var data = {
                        kitchenId: parseInt(req.params.kitchenId),
                        itemId: result.itemId,
                        orderId: result.orderId,
                        ItemStatus: result.itemStatus,
                        orderStatus: newData?.orderStatus,
                        mode: "item",
                        userIds: [orders.qaId],
                        roles: ['kitchen_admin', 'receptionist', 'chef', 'qa']
                    }
                    if (orderData.length > 0) orderData.map(u => { data.userIds.push(u.chefId); });
                    global.pusher.trigger("order", "incoming", {
                        message: JSON.stringify(data)
                    }).then(console.log).catch(e => console.log(e));
                } else {
                    res.status(500).json({ error: "can't update item status" });
                }
            } else {
                res.status(400).json({ "error": "request body required" });
            }
        } else {
            res.status(400).json({ "error": "item not found" });
        }
    } catch (e) {
        console.log(e)
    }
}

exports.declineItem = async (req, res, next) => {
    try {
        if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
            var kitchenId = parseInt(req.params.kitchenId);
            var itemId = req.params.itemId;
            var orderId = req.params.orderId
        } else {
            res.status(400).json({ "error": "request parameters required" });
        }
        let orderData = await orderdetails.get({ kitchenId: kitchenId, orderId: orderId, itemId: itemId });
        if (orderData) {
            if (req.body !== null && req.body !== undefined) {
                var orderObj = {
                    declineReason: req.body.declineReason,
                    itemStatus: 'rejected'
                }
                log.info("Updating order status ===== ");
                let result = await orderdetails.update({ "orderId": orderId, "itemId": itemId }, orderObj);
                if (result) {
                    if (result.itemStatus == "rejected") {
                        var statusObj = {
                            orderStatus: "parked"
                        }
                        await order.update({ "orderId": result.orderId }, statusObj);
                    }
                    res.status(200).json({ message: "Item declined successfully" });
                    let orderTemp = await order.getOne({ "orderId": result.orderId });
                    let orderDetailsTemp = await orderdetails.get({ "orderId": result.orderId });
                    var data = {
                        kitchenId: parseInt(req.params.kitchenId),
                        orderId: result.orderId,
                        itemStatus: result.itemStatus,
                        mode: "item",
                        userIds: [orderTemp.qaId],
                        roles: ['kitchen_admin', 'receptionist', 'chef', 'qa']
                    }
                    if (orderDetailsTemp.length > 0) orderDetailsTemp.map(u => { data.userIds.push(u.chefId); });
                    global.pusher.trigger("order", "incoming", {
                        message: JSON.stringify(data)
                    }).then(console.log).catch(e => console.log(e));
                } else {
                    res.status(500).json({ error: "can't decline item " });
                }
            } else {
                res.status(400).json({ "error": "request body required" });
            }
        } else {
            res.status(400).json({ "error": "item not found" });
        }
    } catch (e) {
        console.log(e);
    }

}

exports.getOrderByQa = async (req, res, next) => {
    try {
        if (req.params != null && req.params != undefined) {

            var qaId = req.params.qaId;
        } else {
            res.json({ "error": "request parameters required" });
        }
        let result = await order.get({ qaId: qaId });
        if (result) {
            res.status(200).json({ "orderDetails": result });
        } else {
            res.status(400).json({ error: "data not found" });
        }
    } catch (e) {
        console.log(e)
    }
}


exports.completeOrderStatus = async (req, res, next) => {
    try {
        if (req.params != null && req.params != undefined) {

            var orderId = req.params.orderId;
        } else {
            res.json({ "error": "request parameters required" });
        }
        let result = await orderdetails.get({ orderId: orderId });
        if (result) {
            if (result.filter(d => d.itemStatus == 'approved').length === result.length) {
                var statusObj = {
                    orderStatus: "readyfordelivery"
                }
                await order.update({ "orderId": orderId }, statusObj);
                res.status(200).json({ "message": "updated order status successfully" });
            } else {
                res.status(400).json({ error: "all items are  not verified" });
            }
        } else {
            res.status(400).json({ error: "data not found" });
        }
    } catch (e) {
        console.log(e)
    }
}

exports.assignOrders = async (req, res, next) => {
    try {
        if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
            var kitchenId = parseInt(req.params.kitchenId);
            var orderId = req.params.orderId
        } else {
            res.status(400).json({ "error": "request parameters required" });
        }
        let orderData = await order.getOne({ kitchenId: kitchenId, orderId: orderId });
        if (orderData) {
            if (req.body !== null && req.body !== undefined) {
                let emp = await employee.getOne({ "employeeId": req.body.qaId })
                var newOrder = {
                    qaId: req.body.qaId,
                    orderStatus: req.body.orderStatu,
                    qaName: emp.Name
                }
                log.info("Updating order ===== ");
                let result = await order.update({ "orderId": orderId }, newOrder);
                if (result) {
                    res.status(200).json({ message: "order assigned to qa successfully" });
                } else {
                    res.status(500).json({ error: "can't update order item" });
                }
            } else {
                res.status(400).json({ "error": "request body required" });
            }
        } else {
            res.status(400).json({ "error": "item not found" });
        }
    } catch (e) {
        console.log(e)
    }
}

exports.getKitchenByVendorId = async (req, res, next) => {
    try {
        if (req.params != null && req.params != undefined) {
            var vendor = req.params.vendorId;
        } else {
            res.json({ "error": "request parameters required" });
        }
        let result = await cloudKitchen.get({ 'merchantConfig.vendorId': vendor });
        if (result.length > 0) {
            res.status(200).json({ "result": result });
        } else {
            res.status(400).json({ error: "No cloud kitchen for this vendor is available" });
        }
    } catch (e) {
        console.log(e)
    }
}