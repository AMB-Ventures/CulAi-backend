const e = require('express');
var role = require('../doa/role');
var Employee = require('../doa/employee');

exports.createRole = async (req, res, next) => {
    try {
        var kitchenId;
        if (req.params != null && req.params != undefined) {
            kitchenId = req.params.kitchenId;
        } else return res.json({ "error": "request parameters required" });
        if (!Object.keys(req.body).length) return res.status(400).json({ error: "required request body" });
        let data = await role.getOne({ role: req.body.role, kitchenId });
        if (data) return res.status(500).json({ error: "role already exists." });
        else {
            var roleObj = req.body;
            roleObj.kitchenId = kitchenId;
            let result = await role.create(roleObj);
            if (result) return res.status(200).json({ message: "role created successfully" });
            else return res.status(500).json({ error: "can't create role" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "role not found." })
    }
}

exports.getRoles = async (req, res, next) => {
    var kitchenId = req.params.kitchenId;
    if (req.body.getAll) var obj = { kitchenId: kitchenId }
    else var obj = { kitchenId: kitchenId, status: true }
    let result = await role.get(obj);
    if (result) {
        res.status(200).json({ items: result });
    } else {
        res.status(500).json({ error: "data not found" });
    }
}
exports.getRoleById = async (req, res, next) => {
    var roleId = req.params._id;
    var kitchenId = req.params.kitchenId;
    let result = await role.getById({ _id: roleId, 'kitchenId': kitchenId });
    if (result) {
        res.status(200).json({ items: result });
    } else {
        res.status(500).json({ error: "data not found" });
    }
}

exports.updateRole = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var roleId = req.params._id;
        var kitchenId = req.params.kitchenId
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    let roleData = await role.getOne({ _id: roleId, kitchenId: kitchenId });
    if (roleData) {
        if (req.body !== null && req.body !== undefined) {
            var newRoleObj = req.body;
            if (newRoleObj.hasOwnProperty('status')) {
                let roleData = await Employee.find({ roleAccessControl: roleId });
                if (roleData.length > 0) return res.status(400).json({ "error": "role is already assigned to an employee" });
            }
            newRoleObj.kitchenId = kitchenId;
            let result = await role.update({ _id: roleId, 'kitchenId': kitchenId }, newRoleObj);
            if (result) {
                res.status(200).json({ message: "role updated successfully", result });
            } else {
                res.status(500).json({ error: "can't update role" });
            }
        } else {
            res.status(400).json({ "error": "request body required" });
        }
    } else {
        res.status(400).json({ "error": "role not found" });
    }
}

exports.deleteRole = async function (req, res) {
    if (req.params._id != null && req.params._id != undefined) {
        var roleId = req.params._id;
        var kitchenId = req.params.kitchenId
    } else {
        res.status(500).json({ "error": "request paramtre required." })
    }
    let roleData = await role.getOne({ _id: roleId, 'kitchenId': kitchenId });
    if (roleData) {

        let roleData = await Employee.find({ roleAccessControl: roleId });
        if (roleData.length > 0) return res.status(400).json({ "error": "role is already assigned to an employee" });

        let result = await role.delete({ _id: roleId, 'kitchenId': kitchenId });
        if (result) {
            res.status(200).json({ "Success": "Role deletion successfull" });
        } else {
            res.status(400).json({ "error": "Deletion failed" });
        }
    } else {
        res.status(500).json({ "error": "Role with this role Id does not exist" });
    }
}