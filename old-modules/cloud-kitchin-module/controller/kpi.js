var order = require('../doa/order');
var orderdetails = require('../doa/order-details');
var Employee = require('../doa/employee');
var log = require('../logger');
var datetime = new Date();
var mongoose = require('mongoose');

const { ObjectID } = require('mongodb');
var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};


exports.getkpis = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var kitchenId = req.params.kitchenId;
        var menuId = req.params.menuId;
        var start = req.params.start;
        var end = req.params.end;
    } else {
        res.json({ "error": "request parameters required" });
    }

    let result = await orderdetails.aggregate(
        [
            [
                {
                    '$match': {
                        'kitchenId': parseInt(kitchenId),
                        'menuId': parseInt(menuId),
                        'createdAt': {
                            '$gte': new Date(start),
                            '$lt': new Date(end)
                        }
                    }
                }, {
                    '$group': {
                        '_id': {
                            '$dateToString': {
                                'format': '%Y-%m-%d',
                                'date': {
                                    '$convert': {
                                        'input': '$createdAt',
                                        'to': 'date',
                                        'onError': 'Error'
                                    }
                                }
                            }
                        },
                        'data': {
                            '$push': '$$ROOT'
                        }
                    }
                }, {
                    '$sort': {
                        '_id': 1
                    }
                }
            ]
        ]
    );
    let barChartLabels = [];
    let barChartData = [];
    let fdata = {};
    result.forEach(p => {
        barChartLabels.push(p._id);
        let groupByData = groupBy(p.data, 'chefId');
        Object.keys(groupByData).forEach(e => {
            if (e != 'undefined') {
                if (!fdata[groupByData[e][0].chefName]) fdata[groupByData[e][0].chefName] = { label: groupByData[e][0].chefName, data: [] }
                let sum = 0;
                groupByData[e].map(u => { sum = sum + u.preparationTime });
                const avg = (sum / groupByData[e].length) || 0;
                fdata[groupByData[e][0].chefName].data.push(avg);
            }
        })
    })

    Object.keys(fdata).map(y => {
        barChartData.push(fdata[y]);
    })
    if (result) {
        res.status(200).json({ barChartData, barChartLabels });
    } else {
        log.error(datetime + " === " + result);
        res.status(500).json({ error: "Id not found" });
    }
}

exports.getQARejectedMenuItemkpis = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var kitchenId = req.params.kitchenId;
        var start = req.params.start;
        var end = req.params.end;
    } else {
        res.json({ "error": "request parameters required" });
    }

    let result = await orderdetails.aggregate(
        [
            [
                {
                    '$match': {
                        $or: [
                            {
                                'kitchenId': parseInt(kitchenId),
                                'createdAt': {
                                    '$gte': new Date(start),
                                    '$lt': new Date(end)
                                },
                                'rejectedByQa': true
                            },
                            {
                                'kitchenId': parseInt(kitchenId),
                                'createdAt': {
                                    '$gte': new Date(start),
                                    '$lt': new Date(end)
                                },
                                'itemStatus': 'rejected'
                            }
                        ]
                    }
                }, {
                    '$group': {
                        '_id': {
                            '$dateToString': {
                                'format': '%Y-%m-%d',
                                'date': {
                                    '$convert': {
                                        'input': '$createdAt',
                                        'to': 'date',
                                        'onError': 'Error'
                                    }
                                }
                            }
                        },
                        'data': {
                            '$push': '$$ROOT'
                        }
                    }
                }, {
                    '$sort': {
                        '_id': 1
                    }
                }
            ]
        ]
    );
    let barChartLabels = [];
    let barChartData = [];
    let fdata = {};
    result.forEach(p => {
        barChartLabels.push(p._id);
        let groupByData = groupBy(p.data, 'chefId');
        Object.keys(groupByData).forEach(e => {
            if (e != 'undefined') {
                if (groupByData[e][0].chefName && !fdata[groupByData[e][0].chefName]) fdata[groupByData[e][0].chefName] = { label: groupByData[e][0].chefName, data: [] }
                let count = 0;
                groupByData[e].map(u => { count = count + 1 });
                fdata[groupByData[e][0].chefName].data.push(count);
            }
        })
    })

    Object.keys(fdata).map(y => {
        barChartData.push(fdata[y]);
    })
    if (result) {
        res.status(200).json({ barChartData, barChartLabels });
    } else {
        log.error(datetime + " === " + result);
        res.status(500).json({ error: "Id not found" });
    }
}

exports.menuCount = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var kitchenId = req.params.kitchenId;
        var menuId = req.params.menuId;
        var start = req.params.start;
        var end = req.params.end;
    } else {
        res.json({ "error": "request parameters required" });
    }

    let result = await orderdetails.aggregate(
        [
            [
                {
                    '$match': {
                        'kitchenId': parseInt(kitchenId),
                        'createdAt': {
                            '$gte': new Date(start),
                            '$lt': new Date(end)
                        }
                    }
                }, {
                    '$group': {
                        '_id': {
                            '$dateToString': {
                                'format': '%Y-%m-%d',
                                'date': {
                                    '$convert': {
                                        'input': '$createdAt',
                                        'to': 'date',
                                        'onError': 'Error'
                                    }
                                }
                            }
                        },
                        'data': {
                            '$push': '$$ROOT'
                        }
                    }
                }, {
                    '$sort': {
                        '_id': 1
                    }
                }
            ]
        ]
    );

    let barChartLabels = [];
    let barChartData = [];
    let fdata = {};
    result.forEach(p => {
        barChartLabels.push(p._id);
        let groupByData = groupBy(p.data, 'menuId');
        Object.keys(groupByData).forEach(e => {
            if (!fdata[groupByData[e][0].menuName]) fdata[groupByData[e][0].menuName] = { label: groupByData[e][0].menuName ? groupByData[e][0].menuName : "No Chef Id", data: [] }
            fdata[groupByData[e][0].menuName].data.push(groupByData[e].length);
        })
    })

    Object.keys(fdata).map(y => {
        barChartData.push(fdata[y]);
    })
    if (result) {
        res.status(200).json({ barChartData, barChartLabels });
    } else {
        log.error(datetime + " === " + result);
        res.status(500).json({ error: "Id not found" });
    }
}

exports.menuAverageTime = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var kitchenId = req.params.kitchenId;
        var menuId = req.params.menuId;
        var start = req.params.start;
        var end = req.params.end;
    } else {
        res.json({ "error": "request parameters required" });
    }

    let result = await orderdetails.aggregate(
        [
            [
                {
                    '$match': {
                        'kitchenId': parseInt(kitchenId),
                        'createdAt': {
                            '$gte': new Date(start),
                            '$lt': new Date(end)
                        }
                    }
                }, {
                    '$group': {
                        '_id': {
                            '$dateToString': {
                                'format': '%Y-%m-%d',
                                'date': {
                                    '$convert': {
                                        'input': '$createdAt',
                                        'to': 'date',
                                        'onError': 'Error'
                                    }
                                }
                            }
                        },
                        'data': {
                            '$push': '$$ROOT'
                        }
                    }
                }, {
                    '$sort': {
                        '_id': 1
                    }
                }
            ]
        ]
    );
    let barChartLabels = [];
    let barChartData = [];
    let fdata = {};
    result.forEach(p => {
        barChartLabels.push(p._id);
        let groupByData = groupBy(p.data, 'menuId');
        Object.keys(groupByData).forEach(e => {
            // barChartLabels.push(groupByData[e][0].chefName);
            if (!fdata[groupByData[e][0].menuName]) fdata[groupByData[e][0].menuName] = { label: groupByData[e][0].menuName ? groupByData[e][0].menuName + `(Prepration Time ${groupByData[e][0].preparationTime}min)` : "No Menu Id", data: [] }
            let sum = 0;
            groupByData[e].map(u => { sum = sum + u.preparationTime });
            const avg = (sum / groupByData[e].length) || 0;
            fdata[groupByData[e][0].menuName].data.push(avg);
        })
    })

    Object.keys(fdata).map(y => {
        barChartData.push(fdata[y]);
    })
    if (result) {
        res.status(200).json({ barChartData, barChartLabels });
    } else {
        log.error(datetime + " === " + result);
        res.status(500).json({ error: "Id not found" });
    }
}

exports.getOrders = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var kitchenId = req.params.kitchenId;
        var orderId = req.params.orderId;
    } else {
        res.json({ "error": "request parameters required" });
    }
    let result = await order.getOrderById({ kitchenId: kitchenId, orderId: orderId });
    if (result) {
        log.info(datetime + " === " + result);
        res.status(200).json({ orderdetails: result });
    } else {
        log.error(datetime + " === " + result);
        res.status(500).json({ error: "Id not found" });
    }
}

exports.getOrdersData = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var kitchenId = req.params.kitchenId;
        var chefId = req.query.chefId;
        var vendorId = req.query.vendorId;
        var orderStatus = req.query.orderStatus;
        var itemStatus = req.query.itemStatus
        var start = req.params.start;
        var end = req.params.end;
    } else {
        res.json({ "error": "request parameters required" });
    }
    let result = "";
    if (vendorId && orderStatus) {
        result = await order.getOrderById({ kitchenId: kitchenId, vendorId: vendorId, orderStatus: orderStatus, createdAt: { '$gte': start, '$lt': end } });
        res.status(200).json({ orderdetails: result })
    } else if (chefId && itemStatus) {
        result = await orderdetails.getOrders({ kitchenId: kitchenId, chefId: chefId, itemStatus: itemStatus, createdAt: { '$gte': start, '$lt': end } });
        res.status(200).json({ orderdetails: result })
    } else if (chefId) {
        result = await orderdetails.getOrders({ kitchenId: kitchenId, chefId: chefId, createdAt: { '$gte': start, '$lt': end } });
        let orderid = [];
        for (let i = 0; i < result.length; i++) {
            orderid.push(result[i]["orderId"]);
        }
        let names = await order.getOrderById({ orderId: orderid })
        res.status(200).json({ orderdetails: names })
    } else if (vendorId) {
        result = await order.getOrderById({ kitchenId: kitchenId, vendorId: vendorId, createdAt: { '$gte': start, '$lt': end } });
        res.status(200).json({ orderdetails: result })
    } else if (orderStatus) {
        result = await order.getOrderById({ kitchenId: kitchenId, orderStatus: orderStatus, createdAt: { '$gte': start, '$lt': end } });
        res.status(200).json({ orderdetails: result })
    } else {
        result = await order.getOrderById({ kitchenId: kitchenId, createdAt: { '$gte': start, '$lt': end } });
        res.status(200).json({ orderdetails: result })
    }
}

exports.failingKpi = async (req, res, next) => {
    try {
        if (req.params != null && req.params != undefined) {
            var kitchenId = req.params.kitchenId;
            var start = req.params.start;
            var end = req.params.end;
        } else {
            res.json({ "error": "request parameters required" });
        }
        let totalOrders = await order.count({ kitchenId: kitchenId });
        if (totalOrders) {
            let parked = await order.count({ kitchenId: kitchenId, orderStatus: "parked", createdAt: { '$gte': start, '$lt': end } });
            let declined = await order.count({ kitchenId: kitchenId, orderStatus: "declined", createdAt: { '$gte': start, '$lt': end } });
            res.status(200).json({ parked: parked, declined: declined });
        } else {
            res.status(400).json({ error: "data not found" });
        }
    } catch (e) {
        console.log(e)
    }
}