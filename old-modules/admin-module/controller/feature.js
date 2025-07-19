const e = require('express');
var feature = require('../doa/feature');
var log = require('../logger');

exports.createFeature = async (req, res, next) => {
    try {
        if (!Object.keys(req.body).length) return res.status(400).json({ error: "required request body" });
        if (!req.body.featureConstant) return res.status(500).json({ error: "Feature Constant is required" });
        let data = await feature.getOne({ featureName: req.body.featureName });
        if (data) return res.status(500).json({ error: "feature already exists." });
        else {
            let result = await feature.create(req.body);
            if (result) return res.status(200).json({ message: "feature created successfully" });
            else return res.status(500).json({ error: "can't create feature" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Feature constant not found." })
    }
}

exports.getFeatures = async (req, res, next) => {
    let result = await feature.get();
    if (result) {
        res.status(200).json({ items: result });
    } else {
        res.status(500).json({ error: "data not found" });
    }
}

exports.getFeaturesById = async (req, res, next) => {
    if (req.params._id != null && req.params._id != undefined) {
        var featureId = req.params._id;
    } else {
        res.json({ "error": "request parameters required" });
    }
    let result = await feature.getById({ _id: featureId });
    if (result) {
        res.status(200).json({ feature: result });
    } else {
        res.status(500).json({ error: "Id not found" });
    }
}

exports.updateFeature = async (req, res, next) => {

    if (req.params != null && req.params != undefined) {
        var featureId = req.params._id;
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    let featureData = await feature.getOne({ _id: featureId });
    if (featureData) {
        if (req.body !== null && req.body !== undefined) {
            var newFeature = {
                featureName: req.body.featureName,
                featureDataType: req.body.featureDataType,
                featureConstant: req.body.featureConstant
            }
            log.info("Updating feature =====> ");
            let result = await feature.update({ "_id": featureId }, newFeature);
            if (result) {
                res.status(200).json({ message: "feature updated successfully" });
            } else {
                res.status(500).json({ error: "can't update feature" });
            }
        } else {
            res.status(400).json({ error: "request body required" });
        }
    } else {
        res.status(400).json({ error: "feature data not found" });
    }
}

exports.removeFeature = async function (req, res) {
    if (req.params._id != null && req.params._id != undefined) {
        var featureId = req.params._id;
    } else {
        res.status(500).json({ error: "request parameters required" });
    }
    let categoryData = await feature.getOne({ _id: featureId });
    if (categoryData) {
        let result = await feature.delete({ _id: featureId });
        log.info("feature deletion started !");
        if (result) {
            res.status(200).json({ message: "feature deleted successfully" });
        } else {
            res.status(500).json({ error: "can't delete feature" });
        }
    } else {
        res.status(400).json({ error: "feature with this featureId does not exist!" });
    }
}

exports.updatePublish = async (req, res, next) => {
    if (req.params._id != null && req.params._id != undefined) {
        var featureId = req.params._id;
    } else {
        res.status(400).json({ "error": "request parameters required" });
    }
    log.info("updating status===== ");
    let data = await feature.getOne({ _id: featureId });
    if (data) {
        if (req.body !== null && req.body !== undefined) {
            var updatePublishObject = {};
            updatePublishObject.published = req.body.published;
            let result = await feature.update({ _id: featureId }, updatePublishObject);
            if (result) {
                log.info(" === " + "success");
                res.status(200).json({ message: "Feature Publish updated successfully" });
            } else {
                log.error(" === " + "failure");
                res.status(500).json({ error: "can't update Publish" });
            }
        } else {
            res.status(400).json({ "error": "request body required" });
        }
    } else {
        res.status(400).json({ "error": "feature not found" })
    }
}