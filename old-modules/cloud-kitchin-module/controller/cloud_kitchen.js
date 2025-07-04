// var vendor = require('../doa/vendor');
var cloudKitchen = require('../doa/cloud_kitchen');
var kitchenConfig = require('../doa/kitchenconfig');
var User = require('../doa/user');
var emailService = require('./email-sender');
var bcrypt = require('bcrypt');
var log = require('../logger');
var exportDoc = require('./export-documents');
var fs = require('fs');
var properties = require('../config/properties');
var datetime = new Date();

//create cloud_kitchen
exports.createCloudkitchen = async (req, res, next) => {
    try {
        if (req.body !== undefined && req.body !== null) {
            let cloud = await cloudKitchen.getOne({ kitchenEmail: req.body.kitchenEmail });
            if (cloud) {
                res.status(500).json({ error: "Cloud_kitchen with this Email already exist.Team will get back to you soon !" });
            } else {
                let kitchenId = await getKitchenNextSequence();
                var cloudKitchenObj = {
                    kitchenId: parseInt(kitchenId) + 1,
                    kitchenName: req.body.kitchenName,
                    kitchenLogo: req.body.kitchenLogo,
                    kitchenDetails: req.body.kitchenDetails,
                    kitchenDemographicDetails: req.body.kitchenDemographicDetails,
                    kitchenEmail: req.body.kitchenEmail,
                    merchantConfig: req.body.merchantConfig,
                    publish: true,
                    busy: false,
                    autoAssign: false
                };
                let results = await cloudKitchen.create(cloudKitchenObj);
                if (results) {
                    let message = "Cloud kitchen added successfully";
                    log.info(datetime + " === " + message);
                    res.status(200).json({ message });
                    if (user) {
                        res.status(500).json({ error: "User with this userId already exist.Team will get back to you soon !" });
                    } else {
                        let otp = generatePassword();
                        let userId = await getUserNextSequence();
                        // console.log(userId, parseInt(userId) + 1)
                        var user = {
                            userId: parseInt(userId) + 1,
                            emailId: req.body.kitchenEmail,
                            name: req.body.Name,
                            profilePic: req.body.kitchenLogo,
                            password: bcrypt.hashSync(otp, 10),
                            role: "kitchen_admin",
                            kitchenId: cloudKitchenObj.kitchenId,
                            lisencekey: uuidv4()
                        };
                        let obj = {
                            type: 'kitchenAdmin',
                            email: user.emailId,
                            password: otp,
                            licenseKey: user.lisencekey,
                            loginlink: process.env.Login_IP + "/kitchin/login"
                        }
                        let serviceRes = emailService.sendEmailNew(enquiryObject.emailId, 'Welcome User', obj)
                        log.info("generating user ===== " + user);
                        log.info("email service response === " + serviceRes);
                        await User.create(user);
                        var kitchenConfigObj = properties.defaultKitchenObject;
                        kitchenConfigObj['kitchenId'] = cloudKitchenObj.kitchenId;
                        kitchenConfigObj['userId'] = user.userId;
                        await kitchenConfig.create(kitchenConfigObj);
                    }
                } else {
                    log.error(datetime + " === " + results);
                    res.status(500).json({ error: "cloud kitchen not added" });
                }

            }

        } else {
            res.status(400).json({ error: "required reuqest body" });
        }
    } catch (e) {
        console.error(e)
    }
}

function getKitchenNextSequence() {
    return new Promise(resolve => {
        return cloudKitchen.findOne().sort([
            ['kitchenId', 'descending']
        ]).limit(1).exec((err, data) => {
            if (data != null) {
                if (data.kitchenId != undefined) {
                    return resolve(data.kitchenId)
                } else {
                    return resolve(0)
                }
            } else return resolve(0)
        })
    })
}

function getUserNextSequence() {
    return new Promise(resolve => {
        return User.findOne().sort([
            ['userId', 'descending']
        ]).limit(1).exec((err, data) => {
            if (data != null) {
                if (data.userId != undefined) {
                    return resolve(data.userId)
                } else {
                    return resolve(0)
                }
            } else return resolve(0)
        })
    })
}

function generatePassword() {
    var length = 4,
        charset = "0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//get all the cloud_kitchens' details present
exports.getCloudkitchens = async (req, res, next) => {
    let result = await cloudKitchen.get();
    if (result) {
        res.status(200).json({ cloud_kitchens: result });
    } else {
        res.status(400).json({ error: "data not found" });
    }
}

//get category details based on employee name.
exports.getCloudkitchenById = async (req, res, next) => {
    if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
        var kitchenId = parseInt(req.params.kitchenId);
    } else {
        res.status(400).json({ "error": "request parameters required" });
    }
    let result = await cloudKitchen.getById({ kitchenId: kitchenId });
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400).json({ error: "Id not found" });
    }
}

//update employee detail
exports.updateCloudkitchen = async (req, res, next) => {
    if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
        var kitchenId = parseInt(req.params.kitchenId);
    } else {
        res.status(400).json({ "error": "request parameters required" });
    }
    let user = await cloudKitchen.getOne({ kitchenId: req.params.kitchenId });
    if (user) {
        if (req.body !== null && req.body !== undefined) {
            var newCloudkitchen = {
                kitchenName: req.body.kitchenName,
                kitchenLogo: req.body.kitchenLogo,
                kitchenDetails: req.body.kitchenDetails,
                kitchenDemographicDetails: req.body.kitchenDemographicDetails,
                // merchantId: req.body.merchantId,
                // vendorId: req.body.vendorId,
                // address: req.body.address,
                // city: req.body.city,
                // country: req.body.country,
                // state: req.body.state,
                // phoneNumber: req.body.phoneNumber,
                publish: req.body.publish,
                merchantConfig: req.body.merchantConfig
                // {
                //     vendorId: req.body.merchantConfig.vendorId,
                //     merchantId: req.body.merchantConfig.merchantId,
                //     merchantName: req.body.merchantConfig.merchantName,
                //      merchantLogo: req.body.merchantConfig.merchantLogo
                // }
            }
            log.info("Updating cloud kitchen ===== ");
            let result = await cloudKitchen.update({ "kitchenId": kitchenId }, newCloudkitchen);
            if (result) {
                log.info(datetime + " === " + result);
                res.status(200).json({ message: "Cloud kitchen updated successfully" });
            } else {
                log.error(datetime + " === " + result);
                res.status(500).json({ error: "can't update user" });
            }
        } else {
            res.status(400).json({ "error": "request body required" });
        }
    } else {
        res.status(400).json({ "error": "user not found" });
    }
}

//remove employee
exports.removeCloudkitchen = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var kitchenId = parseInt(req.params.kitchenId);
    } else {
        res.status(400).json({ "error": "request parameters required" });
    }
    let user = await cloudKitchen.getOne({ kitchenId: kitchenId });
    if (user) {
        let result = await cloudKitchen.delete({ kitchenId: kitchenId });
        log.info("Cloud kitchen deletion started !");
        if (result) {
            let data = await User.getOne({ kitchenId: kitchenId });
            var userId = data.userId;
            await User.delete({ kitchenId: kitchenId, userId: userId });
            res.status(200).json({ message: "Cloud kitchen deleted successfully" });
        } else {
            res.status(400).json({ error: "Id not found" });
        }
    } else {
        res.status(500).json({ error: "Cloud kitchen with this Email does not exist!" });
    }
}

exports.exportDocument = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var exportType = JSON.parse(req.params.exportType);
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    try {
        let result = await cloudKitchen.get();
        var filePath;
        const fileName = "cloudKitchen";
        const fields = ['kitchenName', 'kitchenDetails', 'kitchenDemographicDetails', 'merchantId', 'vendorId', 'kitchenEmail', "publish"];

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
            filePath = await exportDoc.getPdf(result, fileName, 'cloudkitchen');
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
    if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
        var kitchenId = parseInt(req.params.kitchenId);
    } else {
        res.status(400).json({ "error": "request parameters required" });
    }
    let user = await cloudKitchen.getOne({ kitchenId: kitchenId });
    if (user) {
        console.log(user);
        if (req.body !== null && req.body !== undefined) {
            var updatePublishObject = {};
            updatePublishObject.publish = req.body.publish;
            let result = await cloudKitchen.update({ kitchenId: kitchenId }, updatePublishObject);
            if (result) {
                res.status(200).json({ message: "Cloud kitchen Publish updated successfully" });
            } else {
                res.status(500).json({ error: "can't update Publish" });
            }
        } else {
            res.status(400).json({ "error": "request body required" });
        }
    } else {
        res.status(400).json({ "error": "user not found" })
    }
}

exports.busy = async (req, res, next) => {
    if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
        var kitchenId = parseInt(req.params.kitchenId);
    } else {
        res.status(400).json({ "error": "request parameters required" });
    }
    let user = await cloudKitchen.getOne({ kitchenId: kitchenId });
    if (user) {
        // console.log(user);
        if (req.body !== null && req.body !== undefined) {
            var busyObject = {};
            busyObject.busy = req.body.busy
            let result = await cloudKitchen.update({ kitchenId: kitchenId }, busyObject)
            if (result) {
                res.status(200).json({ message: "updated status to busy successfully" });
            } else {
                res.status(500).json({ error: "can't update" });
            }
        } else {
            res.status(400).json({ "error": "request body required" });
        }
    } else {
        res.status(400).json({ "error": "user not found" })
    }
}



// exports.getCloudkitchenBymerchantId = async function(req, res, next) {
//     if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
//         var kitchenId = parseInt(req.params.kitchenId);
//         var merchantId = req.params.merchantId;
//         console.log()
//     } else {
//         res.status(400).json({ "error": "request parameters required" });
//     }
//     let result = await cloudKitchen.getById({ kitchenId: kitchenId });
//     if (result) {
//         console.log("length of object ", result.merchantConfig.length)
//         if (result.merchantConfig.length) {
//             for (let i = 0; result.merchantConfig.length > i; i++) {
//                 console.log('result.merchantConfig[i].merchantId', typeof(result.merchantConfig[i].merchantId))
//                 if (result.merchantConfig[i].merchantId === merchantId) {
//                     console.log(result.merchantConfig[i]);
//                     res.status(200).json(result.merchantConfig[i]);
//                 }
//             }
//             res.status(200).json({ "error": "No Data Found For this merchant id" });
//         } else {
//             res.status(404).json({ "error": "No merchant data is present corresponding to this kitchen id" });
//         }
//         log.info(datetime + " === " + result);
//         // res.status(200).json(result);
//     } else {
//         log.error(datetime + " === " + result);
//         res.status(400).json({ error: "Id not found" });

//     }
// }

exports.autoAssign = async (req, res, next) => {
    if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
        var kitchenId = parseInt(req.params.kitchenId);
    } else {
        res.status(400).json({ "error": "request parameters required" });
    }
    let user = await cloudKitchen.getOne({ kitchenId: kitchenId });
    if (user) {
        // console.log(user);
        if (req.body !== null && req.body !== undefined) {
            var autoAssignObject = {};
            autoAssignObject.autoAssign = req.body.autoAssign
            let result = await cloudKitchen.update({ kitchenId: kitchenId }, autoAssignObject)
            if (result) {
                res.status(200).json({ message: "autoassigned successfully" });
            } else {
                res.status(500).json({ error: "can't autoassign" });
            }
        } else {
            res.status(400).json({ "error": "request body required" });
        }
    } else {
        res.status(400).json({ "error": "user not found" })
    }
}
exports.schedule = async (req, res, next) => {
    if (req.params.kitchenId != null && req.params.kitchenId != undefined) var kitchenId = parseInt(req.params.kitchenId);
    else res.status(400).json({ "error": "request parameters required" });
    let user = await cloudKitchen.getOne({ kitchenId: kitchenId });
    if (user) {
        if (req.body !== null && req.body !== undefined) {
            let schedule = user.schedule;
            Object.keys(JSON.parse(JSON.stringify(schedule))).forEach(element => { schedule[element] = schedule[element].map(j => { return j._id }) });
            Object.keys(JSON.parse(JSON.stringify(req.body.schedule))).forEach(function (key) { if (req?.body?.schedule[key]) schedule[key] = req.body.schedule[key]; });
            req.body.schedule = schedule;
            var obj = {}
            obj.schedule = req.body.schedule;
            let result = await cloudKitchen.update({ kitchenId: kitchenId }, obj)
            if (result) res.status(200).json({ message: "schedule update successfully" });
            else res.status(500).json({ error: "schedule update fail" });
        } else res.status(400).json({ "error": "request body required" });
    } else res.status(400).json({ "error": "kitchen not found" })
}
exports.getSchedule = async (req, res, next) => {
    if (req.params.kitchenId != null && req.params.kitchenId != undefined) var kitchenId = parseInt(req.params.kitchenId);
    else res.status(400).json({ "error": "request parameters required" });
    let user = await cloudKitchen.getOne({ kitchenId: kitchenId });
    if (user) res.status(200).json({ data: [user] });
    else res.status(400).json({ "error": "kitchen not found" })
}

exports.getallmerchants = async (req, res, next) => {
    if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
        var kitchenId = parseInt(req.params.kitchenId);
    } else {
        res.status(400).json({ "error": "request parameters required" });
    }
    let result = await cloudKitchen.getById({ kitchenId: kitchenId });
    if (result) {
        res.status(200).json(result.merchantConfig);
    } else {
        res.status(400).json({ error: "Id not found" });
    }
}