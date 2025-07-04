var vendor = require("../doa/vendor.doa");
var log = require("../logger");
var exportDoc = require("./export-documents.controller");
var fs = require("fs");
const s3ImageUpload = require("./s3ImageUpload.controller");
var datetime = new Date();
const mongoose = require("mongoose");

const createVendor = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }
    const imgUrl = req.file.location;
    let vendorData = {
      name: req.body.name,
      vatNumber: req.body.vatNumber,
      image: imgUrl,
    };
    let result = await vendor.create(vendorData);
    res
      .status(200)
      .json({ message: "Vendor created successfully", vendor: result });
  } catch (e) {
    console.error("Error creating vendor:", e);
    res.status(500).json({ error: e.message });
  }
};

const getVendors = async (req, res, next) => {
  try {
    let vendors = await vendor.get({});

    if (!vendors || vendors.length === 0) {
      return res.status(404).json({ error: "No vendors found" });
    }

    const formattedVendors = vendors.map((vendor) => ({
      _id: vendor._id,
      name: vendor.name,
      image: vendor.image || null,
      VAT: vendor.VAT,
      status: vendor.status,
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
    }));

    res.status(200).json(formattedVendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// vendor getby vendorId etails
const getVendorById = async (req, res, next) => {
  try {
    if (!req.params.vendorId) {
      return res.status(400).json({ error: "Vendor ID is required" });
    }

    // Validate if the vendorId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.vendorId)) {
      return res.status(400).json({ error: "Invalid vendor ID format" });
    }

    const vendorId = req.params.vendorId;
    let result = await vendor.getOne({ _id: vendorId });

    if (result) {
      res.status(200).json({ vendor: result });
    } else {
      res.status(404).json({ error: "Vendor not found" });
    }
  } catch (error) {
    console.error("Error fetching vendor by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// update vendor detail
const updateVendor = async (req, res, next) => {
  try {
    if (!req.params.vendorId) {
      return res.status(400).json({ error: "Vendor ID is required" });
    }

    // Validate if the vendorId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.vendorId)) {
      return res.status(400).json({ error: "Invalid vendor ID format" });
    }

    const vendorId = req.params.vendorId;
    let vendorData = await vendor.getOne({ _id: vendorId });

    if (!vendorData) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is required" });
    }

    // Parse the request body if it's a string
    let bodyData = req.body;
    if (typeof req.body === "string") {
      try {
        bodyData = JSON.parse(req.body);
      } catch (error) {
        return res.status(400).json({ error: "Invalid JSON in request body" });
      }
    }

    // If data is nested in a 'data' property, extract it
    if (bodyData.data) {
      bodyData = JSON.parse(bodyData.data);
    }

    var newVendor = {
      name: bodyData.name,
      VAT: bodyData.VAT || bodyData.vatNumber,
    };

    // Handle image upload if file is present
    let imageResp = null;
    if (req.file) {
      imageResp = await s3ImageUpload(
        req.file,
        `menuimage/${bodyData.name || vendorData.name}`
      );
      if (!imageResp.path.Key) {
        return res.status(500).json({ error: "Can't upload image" });
      }
      newVendor.image = imageResp.path.Key;
    }

    log.info("Updating vendor =====> ");
    let result = await vendor.update({ _id: vendorId }, newVendor);

    if (result) {
      res
        .status(200)
        .json({ message: "Vendor updated successfully", vendor: result });
    } else {
      res.status(500).json({ error: "Can't update vendor" });
    }
  } catch (error) {
    console.error("Error updating vendor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//remove vendor
const removeVendor = async function (req, res) {
  try {
    if (!req.params.vendorId) {
      return res.status(400).json({ error: "Vendor ID is required" });
    }

    // Validate if the vendorId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.vendorId)) {
      return res.status(400).json({ error: "Invalid vendor ID format" });
    }

    const vendorId = req.params.vendorId;

    let vendorData = await vendor.getOne({ _id: vendorId });
    if (!vendorData) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    let result = await vendor.delete({ _id: vendorId });
    log.info("Vendor deletion started !");

    if (result) {
      res.status(200).json({ message: "Vendor deleted successfully" });
    } else {
      res.status(500).json({ error: "Can't delete vendor" });
    }
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const exportDocument = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var exportType = req.params.exportType;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  try {
    let result = await vendor.get();
    var filePath;
    const fileName = "vendor";
    const fields = ["name", "VAT", "status"];
    if (exportType === "csv") {
      filePath = await exportDoc.getCSV(result, fields, fileName);
      res.download(filePath, function (err) {
        if (err) {
          console.log(err);
        }
        fs.unlink(filePath, function () {
          console.log("File was deleted");
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
          console.log("File was deleted");
        });
      });
      return "successfully downloaded";
    } else if (exportType === "pdf") {
      filePath = await exportDoc.getPdf(result, fileName, "vendor");
      res.download(filePath, function (err) {
        if (err) {
          console.log(err);
        }
        fs.unlink(filePath, function () {
          console.log("File was deleted");
        });
      });
      return "successfully downloaded";
    } else {
      console.log("Unsupported File Type");
    }
  } catch (err) {
    console.error(err);
  }
};

const updatePublish = async (req, res, next) => {
  try {
    if (!req.params.vendorId) {
      return res.status(400).json({ error: "Vendor ID is required" });
    }

    // Validate if the vendorId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.vendorId)) {
      return res.status(400).json({ error: "Invalid vendor ID format" });
    }

    const vendorId = req.params.vendorId;
    log.info("updating status===== ");

    let vendorData = await vendor.getOne({ _id: vendorId });
    if (!vendorData) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is required" });
    }

    var updateStatusObject = {};
    // Map publish boolean to status string
    updateStatusObject.status = req.body.publish ? "active" : "disabled";

    let result = await vendor.update({ _id: vendorId }, updateStatusObject);

    if (result) {
      log.info(datetime + " === " + "success");
      res.status(200).json({ message: "Vendor Status Updated successfully" });
    } else {
      log.error(datetime + " === " + "failure");
      res.status(500).json({ error: "Can't update Status" });
    }
  } catch (error) {
    console.error("Error updating vendor status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getVendors,
  createVendor,
  getVendorById,
  updateVendor,
  removeVendor,
  exportDocument,
  updatePublish,
};
