const e = require('express');
var notifications = require('../doa/notifications.doa');
var userDetail = require("../doa/user.doa");

//get all category
exports.getAllNotifications = async function(req, res, next) {
    try {
        if (req.params.userId != null && req.params.userId != undefined) {
            var userId = req.params.userId;
        } else {
        res.json({ code: 400, message: "Request parameters required" });
        }
        let getUserDetails = await userDetail.get({userId});
        let result = [];
        if (getUserDetails[0].role == "cashier") {
            result = await notifications.get({ "status" : { $in : [ "inprogress", "readyforqa", "declined", "completed", "returned", "deleted", "rejectedfromqa" ] } });
        } else if (getUserDetails[0].role == "chef") {
            result = await notifications.get({ "status" : { $in : [ "created", "rejectedfromqa", "completed", "returned" ] } });
        } else if (getUserDetails[0].role == "chef_head") {
            result = await notifications.get({ "status" : { $in : [ "readyforqa" ] } });
        }
       
        if (result) {
            res.json({ code: 200, message:"Notifications get successfully", data: result });       
        } else {
            res.json({ code: 500, message: "data not found", data: [] });
        }
    } catch (err) {
        console.log("Query Error", err);
    }
    
}