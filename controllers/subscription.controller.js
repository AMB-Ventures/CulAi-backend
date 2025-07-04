var subscription = require('../doa/subscription.doa');
var feature = require('../doa/feature.doa');

exports.createSubscription = async (req, res, next) => {
    try {
        if (req.body !== undefined && req.body !== null) {
            let data = await subscription.getOne({ title: req.body.title });
            if (data) {
                res.status(500).json({ error: "Subscription already exists." });
            } else {
                var subscriptionObject = {
                    title: req.body.title,
                    features: req.body.features,
                    amount: req.body.amount,
                    publish: true,
                    subscriptionFrequency: req.body.subscriptionFrequency
                };

                let result = await subscription.create(subscriptionObject);
                if (result) {
                    res.status(200).json({ message: "Subscription created successfully" });
                } else {
                    res.status(500).json({ error: "Can't create subscription" });
                }
            }
        } else {
            res.status(400).json({ error: "required request body" });
        }
    } catch (e) {
        console.error(e)
    }
}

exports.getSubscriptions = async (req, res, next) => {
    if (req.body.getAll) var obj = {}
    else var obj = { publish: true }
    let result = await subscription.get(obj);
    if (result) {
        res.status(200).json({ data: result });
    } else {
        res.status(500).json({ error: "data not found" });
    }
}

exports.getSubscriptionById = async (req, res, next) => {
    if (req.params._id != null && req.params._id != undefined) {
        var subscriptionId = req.params._id;
    } else {
        res.json({ "error": "request parameters required" });
    }
    let result = await subscription.getById({ _id: subscriptionId });
    if (result) {
        res.status(200).json({ subscription: result });
    } else {
        res.status(500).json({ error: "Id not found" });
    }
}

exports.updateSubscription = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var subscriptionId = req.params._id;
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    let subscriptionData = await subscription.getOne({ _id: subscriptionId });
    if (subscriptionData) {
        if (req.body !== null && req.body !== undefined) {
            var newSubscription = {
                title: req.body.title,
                features: req.body.features,
                amount: req.body.amount,
                publish: req.body.publish,
                subscriptionFrequency: req.body.subscriptionFrequency
            }
            let result = await subscription.updateOne({ "_id": subscriptionId }, newSubscription);
            if (result) {
                res.status(200).json({ message: "subscription updated successfully" });
            } else {
                res.status(500).json({ error: "can't update subscription" });
            }
        } else {
            res.status(400).json({ error: "request body required" });
        }
    } else {
        res.status(400).json({ error: "subscription data not found" });
    }
}

exports.removeSubscription = async function (req, res) {
    if (req.params._id != null && req.params._id != undefined) {
        var subscriptionId = req.params._id;
    } else {
        res.status(500).json({ error: "request parameters required" });
    }
    let subscriptionData = await subscription.getOne({ _id: subscriptionId });
    if (subscriptionData) {
        let result = await subscription.delete({ _id: subscriptionId });
        if (result) {
            res.status(200).json({ message: "subscription deleted successfully" });
        } else {
            res.status(500).json({ error: "can't delete subscription" });
        }
    } else {
        res.status(400).json({ error: "subscription with this subscriptionId does not exist!" });
    }
}

exports.updatePublish = async (req, res, next) => {
    if (req.params._id != null && req.params._id != undefined) {
        var subscriptionId = req.params._id;
    } else {
        res.status(400).json({ "error": "request parameters required" });
    }
    let data = await subscription.getOne({ _id: subscriptionId });
    if (data) {
        if (req.body !== null && req.body !== undefined) {
            var updatePublishObject = req.body;
            updatePublishObject.publish = req.body.publish;
            let result = await subscription.update({ _id: subscriptionId }, updatePublishObject);
            if (result) {
                res.status(200).json({ message: "Subscription Publish updated successfully" });
            } else {
                res.status(500).json({ error: "can't update Publish" });
            }
        } else {
            res.status(400).json({ "error": "request body required" });
        }
    } else {
        res.status(400).json({ "error": "subscription not found" })
    }
}