// var vendor = require('../doa/vendor');
var cloudKitchen = require("../doa/cloud_kitchen");
var kitchenConfig = require("../doa/kitchenconfig");
var subscription = require("../doa/subscription");
var User = require("../doa/user");
var Order = require("../doa/order");
var OrderDetails = require("../doa/order-details");
var Employee = require("../doa/employee");
var Menu = require("../doa/menu");
var emailService = require("./email-sender");
var bcrypt = require("bcrypt");
var log = require("../logger");
var exportDoc = require("./export-documents");
var fs = require("fs");
var properties = require("../config/properties");
const s3ImageUpload = require("./s3ImageUpload");
const s3Base64ImageUpload = require("./s3Base64ImageUpload");

var datetime = new Date();
async function uploadMerchantConfig(merchantConfig) {
  await Promise.all(
    merchantConfig.map(async (a, index) => {
      if (a.merchantLogo) {
        let resp = await s3Base64ImageUpload(
          a.merchantLogo,
          `${new Date().getTime()}.${
            a.merchantLogo.split(";")[0].split("/")[1]
          }`,
          a.merchantLogo.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
        );
        merchantConfig[index].merchantLogo = resp.path.key;
      } else {
        merchantConfig[index].merchantLogo = a.merchantLogoTemp;
      }
    })
  );
  return merchantConfig;
}

//create cloud_kitchen
exports.createCloudkitchen = async (req, res, next) => {
  try {
    if (req.body !== undefined && req.body !== null && req.body.data) {
      req.body = JSON.parse(req.body.data);
      let kitchenEmail = req.body.kitchenEmail.toLowerCase();
      let cloud = await cloudKitchen.getOne({
        kitchenEmail: kitchenEmail,
      });
      if (cloud) {
        res.status(500).json({
          error:
            "Cloud_kitchen with this Email already exist.Team will get back to you soon !",
        });
      } else {
        let existingmerchantConfig = await cloudKitchen.getOne({
          "merchantConfig.vendorId": {
            $in: req.body.merchantConfig.map((i) => {
              return i.vendorId;
            }),
          },
          "merchantConfig.merchantId": {
            $in: req.body.merchantConfig.map((i) => {
              return i.merchantId;
            }),
          },
        });
        if (existingmerchantConfig) {
          req.file && fs.unlinkSync(req.file.path);
          return res.status(500).json({
            error: "Merchant with vendor id and merchant name already exists!",
          });
        }
        if (req.body.merchantConfig) {
          req.body.merchantConfig = await uploadMerchantConfig(
            req.body.merchantConfig
          );
        }
        let kitchenId = await getKitchenNextSequence();
        let imageResp = null;
        if (req.file) {
          imageResp = await s3ImageUpload(req.file, `kitchinimage`);
          if (!imageResp.path.Key) {
            res.status(500).json({ error: "can't upload image" });
            return;
          }
        }

        var cloudKitchenObj = {
          kitchenId: parseInt(kitchenId) + 1,
          kitchenName: req.body.kitchenName,
          kitchenDetails: req.body.kitchenDetails,
          kitchenDemographicDetails: req.body.kitchenDemographicDetails,
          kitchenEmail: kitchenEmail,
          merchantConfig: req.body.merchantConfig,
          publish: true,
          busy: "false",
          autoAssign: "false",
        };
        let sData = await subscription.getById({ _id: req.body.subscription });
        var subsData = JSON.parse(JSON.stringify(sData[0]));
        function addDays(date, days) {
          const copy = new Date(Number(date));
          copy.setDate(date.getDate() + days);
          return copy;
        }
        const date = new Date();
        if (subsData?.subscriptionFrequency === "Monthly")
          var newDate = addDays(date, 30).toISOString();
        if (subsData?.subscriptionFrequency === "Half-yearly")
          var newDate = addDays(date, 180).toISOString();
        if (subsData?.subscriptionFrequency === "Yearly")
          var newDate = addDays(date, 360).toISOString();
        subsData.endDate = newDate;
        subsData.startDate = new Date().toISOString();
        cloudKitchenObj.subscription = subsData;
        if (imageResp) cloudKitchenObj.kitchenLogo = imageResp.path.Key;
        let results = await cloudKitchen.create(cloudKitchenObj);
        if (results) {
          let message = "Cloud kitchen added successfully";
          log.info(datetime + " === " + message);
          res.status(200).json({ message });
          if (user) {
            res.status(500).json({
              error:
                "User with this userId already exist.Team will get back to you soon !",
            });
          } else {
            let otp = generatePassword();
            let userId = await getUserNextSequence();
            var user = {
              userId: parseInt(userId) + 1,
              emailId: kitchenEmail,
              name: req.body.kitchenName,
              password: bcrypt.hashSync(otp, 10),
              role: "kitchen_admin",
              kitchenId: cloudKitchenObj.kitchenId,
              lisencekey: uuidv4(),
            };
            let obj = {
              type: "kitchenAdmin",
              name: cloudKitchenObj.kitchenName,
              email: user.emailId,
              password: otp,
              lisencekey: user.lisencekey,
              // loginlink: process.env.Login_IP + "/kitchin/login"
            };
            let serviceRes = emailService.sendEmailNew(
              user.emailId,
              "Welcome User",
              obj
            );
            log.info("generating user ===== " + user);
            log.info("email service response === " + serviceRes);
            await User.create(user);
            var kitchenConfigObj = properties.defaultKitchenObject;
            kitchenConfigObj["kitchenId"] = cloudKitchenObj.kitchenId;
            kitchenConfigObj["userId"] = user.userId;
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
    console.error(e);
  }
};

function getKitchenNextSequence() {
  return new Promise((resolve) => {
    return cloudKitchen
      .findOne()
      .sort([["kitchenId", "descending"]])
      .limit(1)
      .exec((err, data) => {
        if (data != null) {
          if (data.kitchenId != undefined) {
            return resolve(data.kitchenId);
          } else {
            return resolve(0);
          }
        } else return resolve(0);
      });
  });
}

function getUserNextSequence() {
  return new Promise((resolve) => {
    return User.findOne()
      .sort([["userId", "descending"]])
      .limit(1)
      .exec((err, data) => {
        if (data != null) {
          if (data.userId != undefined) {
            return resolve(data.userId);
          } else {
            return resolve(0);
          }
        } else return resolve(0);
      });
  });
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
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

//get all the cloud_kitchens' details present
exports.getCloudkitchens = async (req, res, next) => {
  // var merchantId = req.params.merchantId;
  let result = await cloudKitchen.get();
  if (result) {
    res.status(200).json({ cloud_kitchens: result });
  } else {
    res.status(400).json({ error: "data not found" });
  }
};

//get category details based on employee name.
exports.getCloudkitchenById = async (req, res, next) => {
  if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
    var kitchenId = parseInt(req.params.kitchenId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await cloudKitchen.getById({ kitchenId: kitchenId });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

//update employee detail
exports.updateCloudkitchen = async (req, res, next) => {
  if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
    var kitchenId = parseInt(req.params.kitchenId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let user = await cloudKitchen.getOne({ kitchenId: req.params.kitchenId });
  if (user) {
    if (req.body !== undefined && req.body !== null && req.body.data) {
      req.body = JSON.parse(req.body.data);
      // let existingmerchantConfig = await cloudKitchen.getOne({ 'merchantConfig.vendorId': { $in: req.body.merchantConfig.map(i => { return i.vendorId }) }, 'merchantConfig.merchantId': { $in: req.body.merchantConfig.map(i => { return i.merchantId }) } });
      // if (existingmerchantConfig) {
      //     req.file && fs.unlinkSync(req.file.path);
      //     return res.status(500).json({ error: "Merchant with vendor id and merchant name already exists!" });
      // }
      if (req.body.merchantConfig) {
        req.body.merchantConfig = await uploadMerchantConfig(
          req.body.merchantConfig
        );
      }
      let imageResp = null;
      if (req.file) {
        imageResp = await s3ImageUpload(req.file, `kitchinimage`);
        if (!imageResp.path.Key) {
          res.status(500).json({ error: "can't upload image" });
          return;
        }
      }
      var newCloudkitchen = {
        kitchenName: req.body.kitchenName,
        kitchenDetails: req.body.kitchenDetails,
        kitchenDemographicDetails: req.body.kitchenDemographicDetails,
        merchantConfig: req.body.merchantConfig,
      };
      if (imageResp) newCloudkitchen.kitchenLogo = imageResp.path.Key;
      log.info("Updating cloud kitchen ===== ");
      //subscription
      let sData = await subscription.getById({ _id: req.body.subscription });
      var subsData = JSON.parse(JSON.stringify(sData[0]));
      function addDays(date, days) {
        const copy = new Date(Number(date));
        copy.setDate(date.getDate() + days);
        return copy;
      }
      const date = new Date();
      if (subsData?.subscriptionFrequency === "Monthly")
        var newDate = addDays(date, 30).toISOString();
      if (subsData?.subscriptionFrequency === "Half-yearly")
        var newDate = addDays(date, 180).toISOString();
      if (subsData?.subscriptionFrequency === "Yearly")
        var newDate = addDays(date, 360).toISOString();
      subsData.endDate = newDate;
      subsData.startDate = new Date().toISOString();
      newCloudkitchen.subscription = subsData;
      let result = await cloudKitchen.update(
        { kitchenId: kitchenId },
        newCloudkitchen
      );
      if (result) {
        res.status(200).json({ message: "Cloud kitchen updated successfully" });
      } else {
        res.status(500).json({ error: "can't update user" });
      }
    } else {
      res.status(400).json({ error: "request body required" });
    }
  } else {
    res.status(400).json({ error: "user not found" });
  }
};

//remove employee
// users, menus, employees, orders, order-details
exports.removeCloudkitchen = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var kitchenId = parseInt(req.params.kitchenId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let cloud = await cloudKitchen.getOne({ kitchenId: kitchenId });
  if (cloud) {
    let result = await cloudKitchen.delete({ kitchenId: kitchenId });
    log.info("Cloud kitchen deletion started !");
    if (result) {
      await kitchenConfig.deleteM({ kitchenId: kitchenId });
      await User.deleteM({ kitchenId: kitchenId });
      await Order.deleteM({ kitchenId: kitchenId });
      await OrderDetails.deleteM({ kitchenId: kitchenId });
      await Menu.deleteM({ kitchenId: kitchenId });
      await Employee.deleteM({ kitchenId: kitchenId });
      //TODO: delete menu pending
      res.status(200).json({ message: "Cloud kitchen deleted successfully" });
    } else {
      res.status(400).json({ error: "Id not found" });
    }
  } else {
    res
      .status(500)
      .json({ error: "Cloud kitchen with this Email does not exist!" });
  }
};

exports.exportDocument = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var exportType = req.params.exportType;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  try {
    let result = await cloudKitchen.get();
    var cloudkitch = JSON.stringify(result);
    var tempobj = {
      kitchenId: "BrandId",
      kitchenName: "BrandName",
      kitchenDetails: "BrandDetails",
      kitchenDemographicDetails: "BrandDemographicDetails",
      kitchenEmail: "BrandEmail",
      kitchenLogo: "BrandLogo",
    };
    cloudkitch = JSON.parse(
      cloudkitch.replace(
        /\b(?:kitchenId|kitchenName|kitchenDetails|kitchenDemographicDetails|kitchenEmail|kitchenLogo)\b/gi,
        (matched) => tempobj[matched]
      )
    );
    var filePath;
    const fileName = "cloudKitchen";
    const fields = [
      "BrandId",
      "BrandName",
      "BrandDetails",
      "BrandDemographicDetails",
      "BrandEmail",
      "merchantConfig",
      "publish",
    ];

    if (exportType === "csv") {
      filePath = await exportDoc.getCSV(cloudkitch, fields, fileName);
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
      filePath = await exportDoc.getXLSX(cloudkitch, fields, fileName);
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
      filePath = await exportDoc.getPdf(result, fileName, "cloudkitchen");
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

exports.updatePublish = async (req, res, next) => {
  if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
    var kitchenId = parseInt(req.params.kitchenId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  log.info("updating status===== ");
  let user = await cloudKitchen.getOne({ kitchenId: kitchenId });
  if (user) {
    // console.log(user);
    if (req.body !== null && req.body !== undefined) {
      var updatePublishObject = {};
      updatePublishObject.publish = req.body.publish;
      let result = await cloudKitchen.update(
        { kitchenId: kitchenId },
        updatePublishObject
      );
      if (result) {
        log.info(datetime + " === " + "success");
        res
          .status(200)
          .json({ message: "Cloud kitchen Publish updated successfully" });
      } else {
        log.error(datetime + " === " + "failure");
        res.status(500).json({ error: "can't update Publish" });
      }
    } else {
      res.status(400).json({ error: "request body required" });
    }
  } else {
    res.status(400).json({ error: "user not found" });
  }
};

exports.getCloudkitchenBymerchantId = async (req, res, next) => {
  if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
    var kitchenId = parseInt(req.params.kitchenId);
    var merchantId = req.params.merchantId;
    console.log();
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await cloudKitchen.getById({ kitchenId: kitchenId });
  if (result) {
    console.log("length of object ", result.merchantConfig.length);
    if (result.merchantConfig.length) {
      for (let i = 0; result.merchantConfig.length > i; i++) {
        // console.log('result.merchantConfig[i].merchantId', typeof (result.merchantConfig[i].merchantId))
        if (result.merchantConfig[i].merchantId === merchantId) {
          console.log(result.merchantConfig[i]);
          res.status(200).json(result.merchantConfig[i]);
        }
      }
      res.status(200).json({ error: "No Data Found For this merchant id" });
    } else {
      res.status(404).json({
        error: "No merchant data is present corresponding to this kitchen id",
      });
    }
    log.info(datetime + " === " + result);
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

exports.getallmerchants = async (req, res, next) => {
  if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
    var kitchenId = parseInt(req.params.kitchenId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await cloudKitchen.getById({ kitchenId: kitchenId });
  if (result) {
    res.status(200).json(result.merchantConfig);
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

exports.updateSubscription = async (req, res, next) => {
  if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
    var kitchenId = parseInt(req.params.kitchenId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await cloudKitchen.getById({ kitchenId: kitchenId });
  if (result) {
    let sData = await subscription.getById({ _id: req.body.subscription });
    if (sData) {
      let subscriptionObject = {};
      var subsData = JSON.parse(JSON.stringify(sData[0]));
      function addDays(date, days) {
        const copy = new Date(Number(date));
        copy.setDate(date.getDate() + days);
        return copy;
      }
      const date = new Date();
      if (subsData.subscriptionFrequency === "Monthly")
        var newDate = addDays(date, 30).toISOString();
      if (subsData.subscriptionFrequency === "Half-yearly")
        var newDate = addDays(date, 180).toISOString();
      if (subsData.subscriptionFrequency === "Yearly")
        var newDate = addDays(date, 360).toISOString();
      subsData.endDate = newDate;
      subsData.startDate = new Date().toISOString();
      subscriptionObject.subscription = subsData;
      let fData = await cloudKitchen.update(
        { kitchenId: kitchenId },
        subscriptionObject
      );
      res.status(200).json(fData);
    } else {
      res.status(400).json({ error: "Subscription not found" });
    }
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};
