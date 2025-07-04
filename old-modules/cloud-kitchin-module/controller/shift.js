const e = require('express');
var shift = require('../doa/shift');

exports.createShift = async (req, res, next) => {
    try {
        var kitchenId;
        if (req.params != null && req.params != undefined) {
            kitchenId = req.params.kitchenId;
        } else return res.json({ "error": "request parameters required" });
        if (!Object.keys(req.body).length) return res.status(400).json({ error: "required request body" });
        let data = await shift.getOne({ shift: req.body.shift, kitchenId, shiftType: req.body.shiftType });
        if (data) return res.status(500).json({ error: "shift already exists." });
        else {
            var shiftObj = req.body;
            shiftObj.kitchenId = kitchenId;
            let result = await shift.create(shiftObj);
            if (result) return res.status(200).json({ message: "shift created successfully" });
            else return res.status(500).json({ error: "can't create shift" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "shift not found." })
    }
}

exports.getShifts = async (req, res, next) => {
    var kitchenId = req.params.kitchenId;
    if (!req.body.shiftType) res.status(500).json({ error: "shiftType is required" });
    if (req.body.getAll) var obj = { kitchenId: kitchenId, shiftType: req.body.shiftType }
    else var obj = { kitchenId: kitchenId, shiftType: req.body.shiftType, slot: true }
    let result = await shift.get(obj);
    if (result) {
        res.status(200).json({ items: result });
    } else {
        res.status(500).json({ error: "data not found" });
    }
}
exports.getShiftById = async (req, res, next) => {
    var id = req.params._id;
    var kitchenId = req.params.kitchenId;
    let result = await shift.getById({ _id: id, 'kitchenId': kitchenId });
    if (result) {
        res.status(200).json({ items: result });
    } else {
        res.status(500).json({ error: "data not found" });
    }
}

exports.updateShift = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var shiftId = req.params._id;
        var kitchenId = req.params.kitchenId
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    let shiftData = await shift.getOne({ _id: shiftId, kitchenId: kitchenId });
    if (shiftData) {
        if (req.body !== null && req.body !== undefined) {
            let result = await shift.update({ _id: shiftId, 'kitchenId': kitchenId }, req.body);
            if (result) {
                res.status(200).json({ message: "shift updated successfully", result });
            } else {
                res.status(500).json({ error: "can't update shift" });
            }
        } else {
            res.status(400).json({ "error": "request body required" });
        }
    } else {
        res.status(400).json({ "error": "shift not found" });
    }
}

exports.deleteShift = async function (req, res) {
    if (req.params._id != null && req.params._id != undefined) {
        var shiftId = req.params._id;
        var kitchenId = req.params.kitchenId
    } else {
        res.status(500).json({ "error": "request paramtre required." })
    }
    let shiftData = await shift.getOne({ _id: shiftId, 'kitchenId': kitchenId });
    if (shiftData) {
        let result = await shift.delete({ _id: shiftId, 'kitchenId': kitchenId });
        if (result) {
            res.status(200).json({ "Success": "shift deletion successfull" });
        } else {
            res.status(400).json({ "error": "Deletion failed" });
        }
    } else {
        res.status(500).json({ "error": "shift with this shift Id does not exist" });
    }
}

exports.updateOnAndOff = async (req, res, next) => {
    if (req.params._id != null && req.params._id != undefined) {
        var shiftId = req.params._id;
        var kitchenId = req.params.kitchenId
    } else {
        res.status(400).json({ "error": "request parameters required" });
    }
    let data = await shift.getOne({ _id: shiftId, kitchenId: kitchenId });
    if (data) {
        if (req.body !== null && req.body !== undefined) {
            var updateOnAndOff = {};
            updateOnAndOff.slot = req.body.slot;
            let result = await shift.update({ _id: shiftId }, updateOnAndOff);
            if (result) {
                res.status(200).json({ message: "Slot updated successfully" });
            } else {
                res.status(500).json({ error: "can't update Slot" });
            }
        } else {
            res.status(400).json({ "error": "request body required" });
        }
    } else {
        res.status(400).json({ "error": "shift not found" })
    }
}