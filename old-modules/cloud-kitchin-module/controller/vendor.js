var vendor = require('../doa/vendor');
var log = require('../logger');
var exportDoc = require('./export-documents');
var fs = require('fs');
var datetime = new Date();

exports.createVendor = async (req, res, next) => {
    try {
        if (req.body !== undefined && req.body !== null) {
            let data = await vendor.getOne({ vendorName: req.body.vendorName });
            if (data) {
                res.status(500).json({ error: "vendor is already exist." });
            } else {
                var Id = await getNextSequence();
                console.log("ww ae here", req.body)
                var vendorObject = {
                    vendorName: req.body.vendorName,
                    vendorId: parseInt(Id) + 1,
                    vendorLogo: req.body.vendorLogo,
                    licenseKey: req.body.licenseKey,
                    webHookUrl: req.body.webHookUrl,
                    publish: true
                };
                let result = await vendor.create(vendorObject);
                if (result) {
                    res.status(200).json({ message: "vendor created successfully" });
                } else {
                    res.status(500).json({ error: "can't create vendor" });
                }
            }
        } else {
            res.status(400).json({ error: "required request body" });
        }
    } catch (e) {
        console.error(e)
    }
}

function getNextSequence() {
    return new Promise(resolve => {
        return vendor.findOne().sort([
            ['vendorId', 'descending']
        ]).limit(1).exec((err, data) => {
            if (data != null) {
                if (data.vendorId != undefined) {
                    return resolve(data.vendorId)
                } else {
                    return resolve(0)
                }
            } else return resolve(0)
        })
    })
}

//get all vendor
exports.getVendors = async (req, res, next) => {
    let result = await vendor.get();
    if (result) {
        res.status(200).json({ items: result });
    } else {
        res.status(400).json({ error: "data not found" });
    }
}

// vendor getby vendorId etails 
exports.getVendorById = async (req, res, next) => {
    if (req.params.vendorId != null && req.params.vendorId != undefined) {
        var vendorId = req.params.vendorId;
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    let result = await vendor.getById({ vendorId: vendorId });
    if (result) {
        res.status(200).json({ vendor: result });
    } else {
        res.status(400).json({ error: "Id not found" });
    }
}

// update vendor detail
exports.updateVendor = async (req, res, next) => {
    if (req.params.vendorId != null && req.params.vendorId != undefined) {
        var vendorId = parseInt(req.params.vendorId);
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    let vendorData = await vendor.getOne({ vendorId: req.params.vendorId });
    if (vendorData) {
        if (req.body !== null && req.body !== undefined) {
            var newVendor = {
                vendorLogo: req.body.vendorLogo,
                licenseKey: req.body.licenseKey,
                webHookUrl: req.body.webHookUrl,
            }
            log.info("Updating vendor =====> ");
            let result = await vendor.update({ "vendorId": vendorId }, newVendor);
            if (result) {
                res.status(200).json({ message: "vendor updated successfully" });
            } else {
                res.status(500).json({ error: "can't update vendor" });
            }
        } else {
            res.status(400).json({ error: "request body required" });
        }
    } else {
        res.status(400).json({ error: "vendor data not found" });
    }
}

//remove vendor
exports.removeVendor = async function (req, res) {
    if (req.params.vendorId != null && req.params.vendorId != undefined) {
        var vendorId = parseInt(req.params.vendorId);
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    let vendorData = await vendor.getOne({ vendorId: vendorId });
    if (vendorData) {
        let result = await vendor.delete({ vendorId: vendorId });
        log.info("Vendor deletion started !");
        if (result) {
            res.status(200).json({ message: "Vendor deleted successfully" });
        } else {
            res.status(500).json({ error: "can't delete vendor" });
        }
    } else {
        res.status(400).json({ error: "Vendor with this vendorId does not exist!" });
    }
}

exports.exportDocument = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var exportType = JSON.parse(req.params.exportType);
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    try {
        let result = await vendor.get();
        var filePath;
        const fileName = "vendor";
        const fields = ['vendorName', 'licenseKey', 'webHookUrl', 'publish'];
        if (exportType === "csv") {
            filePath = await exportDoc.getCSV(result, fields, fileName);
            res.download(filePath, function (err) {
                if (err) {
                    console.log(err);
                }
                fs.unlink(filePath, function () {
                    console.log("File was deleted")
                });
            });
            return "successfully downloaded";
        } else if (exportType === "xlsx") {
            filePath = await exportDoc.getCSV(result, fields, fileName);
            filePath = await exportDoc.getXLSX(result, fields, fileName);
            res.download(filePath, function (err) {
                if (err) {
                    console.log(err);
                }
                fs.unlink(filePath, function () {
                    console.log("File was deleted")
                });
            });
            return "successfully downloaded";
        } else if (exportType === "pdf") {
            filePath = await exportDoc.getPdf(result, fileName, 'vendor');
            res.download(filePath, function (err) {
                if (err) {
                    console.log(err);
                }
                fs.unlink(filePath, function () {
                    console.log("File was deleted")
                });
            });
            return "successfully downloaded";
        } else {
            console.log("Unsupported File Type")
        }
    } catch (err) {
        console.error(err);
    }
}


exports.updatePublish = async (req, res, next) => {
    if (req.params.vendorId != null && req.params.vendorId != undefined) {
        var vendorId = parseInt(req.params.vendorId);
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    log.info("updating publish===== ");
    let vendorData = await vendor.getOne({ vendorId: vendorId });
    if (vendorData) {
        if (req.body !== null && req.body !== undefined) {
            var updatePublishObject = {};
            updatePublishObject.publish = req.body.publish;
            let result = await vendor.update({ vendorId: vendorId }, updatePublishObject);
            if (result) {
                log.info(datetime + " === " + "success");
                res.status(200).json({ message: "Vendor Publish Updated successfully" });
            } else {
                log.error(datetime + " === " + "failure");
                res.status(500).json({ error: "can't update Publish" });
            }
        } else {
            res.status(400).json({ error: "request body required" });
        }
    } else {
        res.status(400).json({ error: "vendor data not found" })
    }
}