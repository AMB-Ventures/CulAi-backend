const express = require("express");
const router = express.Router();
var stationsController = require("../controllers/stations.controller");

// const Joi = require("joi");
// const validator = require("express-joi-validation").createValidator({});

router.get("/vendor-stations/:vendorId?", stationsController.getVendorStations);
router.post("/vendor-station", stationsController.createVendorStations);
router.put(
  "/vendor-stations/:stationId",
  stationsController.updateVendorStations
);
router.delete("/vendor-stations", stationsController.deleteVendorStations);

module.exports = router;
