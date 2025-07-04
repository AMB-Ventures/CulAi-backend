var mongoose = require("mongoose");
var taxGroupSchema = require("../schemas/taxGroup.schema");

var taxGroupModel = mongoose.model("taxGroup", taxGroupSchema, "taxGroups");
module.exports = taxGroupModel;
