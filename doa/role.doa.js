var mongoose = require("mongoose");
var roleSchema = require("../schemas/role.schema");

var roleModel = mongoose.model("role", roleSchema);
module.exports = roleModel;
