const express = require("express");
const router = express.Router();
var taxGroupController = require("../controllers/taxGroup.controller");

router.get(
  "/",
  taxGroupController.getTaxGroups
);

module.exports = router;
