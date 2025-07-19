/*
The code below act as service layer for onboard based ops.
*/
var inquiry = require('../doa/inquiry.doa');
var log = require('../logger');
var exportDoc = require('./export-documents.controller');
var fs = require('fs');
var datetime = new Date();
// var emailService = require('./email-sender')
// var bcrypt = require('bcrypt');

//create enquiry
exports.createInquiry = async (req, res, next) => {
    try {
        if (req.body !== undefined && req.body !== null) {
            let user = await inquiry.getOne({ emailId: req.body.emailId });
            if (user) {
                res.status(500).json({ error: "Inquiry with this Email already exist.Team will get back to you soon !" });
            } else {
                let Id = await getNextSequence();
                var inquiryObj = {
                    inquiryId: parseInt(Id) + 1,
                    kitchenName: req.body.kitchenName,
                    kitchenLogo: req.body.kitchenLogo,
                    address: req.body.address,
                    city: req.body.city,
                    country: req.body.country,
                    state: req.body.state,
                    phoneNumber: req.body.phoneNumber,
                    emailId: req.body.emailId,
                    status: "pending",
                }
            };
            let result = await inquiry.create(inquiryObj);
            if (result) {
                let message = "Inquiry Submitted successfully";
                res.status(200).json({ message });
            } else {
                res.status(500).json({ error: "Inquiry not added" });
            }
        } else {
            res.status(400).json({ error: "required reuqest body" });
        }
    } catch (e) {
        console.error(e)
    }
}

function getNextSequence() {
    return new Promise(resolve => {
        return inquiry.findOne().sort([
            ['inquiryId', 'descending']
        ]).limit(1).exec((err, data) => {
            if (data != null) {
                if (data.inquiryId != undefined) {
                    return resolve(data.inquiryId)
                } else {
                    return resolve(0)
                }
            } else return resolve(0)
        })
    })
}

//get onboard details details based on employee name.
exports.getInquiryByID = async (req, res, next) => {
    if (req.params.inquiryId != null && req.params.inquiryId != undefined) {
        var inquiryId = req.params.inquiryId;
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    let result = await inquiry.getById({ inquiryId: inquiryId });
    log.info(req.params.inquiryId);
    if (result) {
        res.json({ Inquiry: result });
        res.status(200)
    } else {
        res.status(400).json({ error: "Inquiry does not exist" });
    }
}

//get all data
exports.getInquiries = async (req, res, next) => {
    let result = await inquiry.get({});
    if (result) {
        res.json({ inquiry: result });
        res.status(200);
    } else {
        res.status(400).json({ error: "data not found" });
    }
}

//remove onboard

exports.removeInquiry = async (req, res, next) => {
    let user = await inquiry.getOne({ inquiryId: req.params.inquiryId });
    if (req.params.inquiryId != null && req.params.inquiryId != undefined) {
        var inquiryId = req.params.inquiryId;
    } else {
        res.json({ "error": "request parameters required" }, 400);
    }
    if (user) {
        let result = await inquiry.delete({ inquiryId: inquiryId });
        log.info("Inquiry deletion started !");
        if (result) {
            res.status(200).json({ message: "Enquiry deleted successfully" });
        } else {

            log.error(datetime + " === " + "not able to delete Enquiry");
            res.status(500).json({ error: "not able to delete Enquiry" });
        }
    } else {
        res.status(400).json({ error: "Enquiry with this Email does not exist!" });
    }
}
//update enquiry status to active and send red on mail.
exports.updateStatus = async (req, res, next) => {
    if (req.params.inquiryId != null && req.params.inquiryId != undefined) {
        var inquiryId = req.params.inquiryId;
    } else {
        res.status(400).json({ "error": "request parameters required" });
    }
    log.info("updating status===== ");
    let user = await inquiry.getOne({ inquiryId: inquiryId });
    if (user) {
        console.log(user);
        if (req.body !== null && req.body !== undefined) {
            var updateStatusObject = {};
            updateStatusObject.status = req.body.status;
            let result = await inquiry.update({ inquiryId: inquiryId }, updateStatusObject);
            if (result) {
                log.info(datetime + " === " + "success");
                res.status(200).json({ message: "Inquiry status updated successfully" });
            } else {
                log.error(datetime + " === " + "failure");
                res.status(500).json({ error: "can't update status" });
            }
        } else {
            res.status(400).json({ error: "request body required" });
        }
    } else {
        res.status(400).json({ error: "user not found" })
    }
}

exports.exportDocument = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var exportType = req.params.exportType;
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    try {
        let result = await inquiry.get();
        var filePath;
        const fileName = "inquiry";
        const fields = ['kitchenName', 'address', 'city', 'country', 'state', 'phoneNumber', 'emailId'];

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
            filePath = await exportDoc.getPdf(result, fileName, 'inquiry');
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