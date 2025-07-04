var enquiry = require("../doa/enquiry");
var subscription = require("../doa/subscription");
var log = require("../logger");
var exportDoc = require("./export-documents");
var fs = require("fs");
var emailService = require("./email-sender");
var bcrypt = require("bcrypt");
var cloudKitchen = require("../doa/cloud_kitchen");
var subAdmin = require("../doa/subadmin");
var cloudKitchen = require("../doa/cloud_kitchen");
var User = require("../doa/user");
var kitchenConfig = require("../doa/kitchenconfig");
var properties = require("../config/properties");
var password = require("../doa/resetpassword");

const Pusher = require("pusher");
global.pusher = new Pusher({
  appId: process.env.pusherAppId,
  key: process.env.pusherKey,
  secret: process.env.pusherSecret,
  cluster: "ap2",
  useTLS: true,
});

var datetime = new Date();
const s3ImageUpload = require("./s3ImageUpload");

exports.createEnquiry = async (req, res, next) => {
  try {
    if (req.body !== undefined && req.body !== null && req.body.data) {
      req.body = JSON.parse(req.body.data);
      let emailId = req.body.emailId.toLowerCase();
      let cData = await cloudKitchen.getOne({ kitchenEmail: emailId });
      if (cData) {
        return res
          .status(500)
          .json({ error: "This email is already registered" });
      }
      let data = await enquiry.getOne({ emailId: emailId });
      if (data) {
        res.status(500).json({ error: "This email is already registered" });
      } else {
        var Id = await getNextSequence();
        let imageResp = null;
        let fileResp = null;
        if (req.files) {
          if (req.files.doc) {
            fileResp = await s3ImageUpload(req.files.doc[0], `enquiryfile`);
            if (!fileResp.path.Key) {
              res.status(500).json({ error: "can't upload file" });
              return;
            }
          }
          if (req.files.image) {
            imageResp = await s3ImageUpload(req.files.image[0], `enquiryimage`);
            if (!imageResp.path.Key) {
              res.status(500).json({ error: "can't upload image" });
              return;
            }
          }
        }
        // if (req.file) {
        //     imageResp = await s3ImageUpload(req.file, `enquiryimage`);
        //     if (!imageResp.path.Key) {
        //         res.status(500).json({ error: "can't upload image" });
        //         return
        //     }
        // }
        var enquiryObject = {
          Name: req.body.Name,
          enquiryId: parseInt(Id) + 1,
          emailId: emailId,
          mobileNumber: req.body.mobileNumber,
          brandName: req.body.brandName,
          brandLogo: imageResp ? imageResp.path.Key : "",
          uploadFile: fileResp ? fileResp.path.Key : "",
          webSite: req.body.webSite,
          cr_maroof: req.body.cr_maroof,
          designation: req.body.designation,
          dishes: req.body.dishes,
          services: req.body.services,
          WayremServices: req.body.WayremServices,
          // description: req.body.description,
          city_branches: req.body.city_branches,
          subscription: "",
          bankDetailsUpload: "",
          other: req.body.other,
          userStatus: [
            {
              enquiryStatus: {
                approved: false,
                submitted: true,
                correction: false,
              },
              onboardingStatus: {
                approved: false,
                submitted: false,
                correction: false,
              },
              cloudKitchenStatus: {
                approved: false,
                submitted: false,
                correction: false,
              },
            },
          ],
        };
        let result = await enquiry.create(enquiryObject);
        if (result) {
          let obj = {
            type: "enquiry",
            name: enquiryObject.Name,
            // loginlink: process.env.Login_IP + "/kitchin/login"
          };
          log.info(obj.name);
          let serviceRes = emailService.sendEmailNew(
            enquiryObject.emailId,
            "Welcome User",
            obj
          );
          log.info("generating user ===== " + "success");
          log.info("email service response === " + serviceRes);

          global.pusher
            .trigger("order", "enquiry", {
              message: "New Enquiry Generated",
            })
            .then(console.log)
            .catch((e) => console.log(e));

          res.status(200).json({ message: "enquiry created successfully" });
        } else {
          res.status(500).json({ error: "can't create enquiry" });
        }
      }
    } else {
      res.status(400).json({ error: "required request body" });
    }
  } catch (e) {
    console.error(e);
  }
};

function getNextSequence() {
  return new Promise((resolve) => {
    return enquiry
      .findOne()
      .sort([["enquiryId", "descending"]])
      .limit(1)
      .exec((err, data) => {
        if (data != null) {
          if (data.enquiryId != undefined) {
            return resolve(data.enquiryId);
          } else {
            return resolve(0);
          }
        } else return resolve(0);
      });
  });
}

//get all enquiry
exports.getEnquiries = async (req, res, next) => {
  let result = await enquiry.get({
    $or: [{ status: "new" }, { status: "rejected" }],
  });
  if (result) {
    if (req.user.role == "super_admin") {
      res.status(200).json({ items: result });
    } else {
      const userId = req.user.userId;
      let enquiries = await enquiry.get({
        assignedTo: userId,
        $or: [{ status: "new" }, { status: "rejected" }],
      });
      res.status(200).json({ items: enquiries });
    }
  } else {
    res.status(200).json({ error: "data not found" });
  }
};

// vendor getby vendorId etails
exports.getEnquiryById = async (req, res, next) => {
  if (req.params.enquiryId != null && req.params.enquiryId != undefined) {
    var enquiryId = parseInt(req.params.enquiryId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await enquiry.getById({ enquiryId: enquiryId, status: "new" });
  if (result) {
    res.status(200).json({ vendor: result });
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

exports.approveOrRejectEnquiry = async (req, res, next) => {
  if (req.params.enquiryId != null && req.params.enquiryId != undefined) {
    var enquiryId = parseInt(req.params.enquiryId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await enquiry.getById({ enquiryId: enquiryId });
  if (result) {
    let otp = generatePassword();
    var emailId = result[0].emailId;
    result[0].status = req.body.status;
    result[0].rejectionReason = req.body.rejectionReason;
    if (req.body.status === "accepted") {
      let obj = {
        type: "approved enquiry",
        name: result[0].Name,
        email: emailId,
        password: otp,
        // onboardinglink: "http://15.184.231.81" + "/website/onboarding"
      };
      result[0].userStatus[0].enquiryStatus[0].approved = "true";
      result[0].rejectionReason = "";
      result[0].password = bcrypt.hashSync(otp, 10);
      await enquiry.updateOne({ enquiryId: enquiryId }, result[0]);
      emailService.sendEmailNew(result[0].emailId, "Welcome User", obj);
      res.status(200).json({ message: "approved mail sent successfully" });
    } else if (req.body.status === "rejected") {
      let obj = {
        type: "refused enquiry",
        name: result[0].Name,
        rejectionReason: req.body.rejectionReason,
      };
      result[0].userStatus[0].enquiryStatus[0].correction = "true";
      result[0].userStatus[0].enquiryStatus[0].approved = "false";
      await enquiry.updateOne({ enquiryId: enquiryId }, result[0]);
      emailService.sendEmailNew(result[0].emailId, "Welcome User", obj);
      res.status(200).json({ message: "refused mail sent successfully" });
    } else {
      result[0].status = "new";
      await enquiry.updateOne({ enquiryId: enquiryId }, result[0]);
      res.status(200).json({ message: "Status change to new" });
    }
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

exports.createOnboardingData = async (req, res, next) => {
  if (req.body != null && req.body != undefined && req.body.data) {
    var enquiryId = parseInt(req.params.enquiryId);
    req.body = JSON.parse(req.body.data);
  } else {
    return res.status(400).json({ error: "request parameters required" });
  }
  let data = await enquiry.getOne({
    enquiryId: enquiryId,
    $or: [{ status: "accepted" }, { status: "rejected onboarding" }],
  });
  if (!data) return res.status(400).json({ error: "onbording is not exist" });
  const emailId = data.emailId;
  if (data) {
    let menuListResp = null;
    let menuItemsPhotoResp = null;
    let ndaResp = null;
    let logoResp = null;
    let contractResp = null;
    if (req.files) {
      if (req.files.menuList) {
        menuListResp = await s3ImageUpload(
          req.files.menuList[0],
          `onboardingfile`
        );
        if (!menuListResp.path.Key) {
          res.status(500).json({ error: "can't upload file" });
          return;
        }
      }
      if (req.files.logo) {
        logoResp = await s3ImageUpload(req.files.logo[0], `onboardingfile`);
        if (!logoResp.path.Key) {
          res.status(500).json({ error: "can't upload file" });
          return;
        }
      }
      if (req.files.menuItems) {
        menuItemsPhotoResp = await s3ImageUpload(
          req.files.menuItems[0],
          `onboardingfile`
        );
        if (!menuItemsPhotoResp.path.Key) {
          res.status(500).json({ error: "can't upload file" });
          return;
        }
      }
      if (req.files.nda) {
        ndaResp = await s3ImageUpload(req.files.nda[0], `onboardingfile`);
        if (!ndaResp.path.Key) {
          res.status(500).json({ error: "can't upload image" });
          return;
        }
      }
      if (req.files.contract) {
        contractResp = await s3ImageUpload(
          req.files.contract[0],
          `onboardingfile`
        );
        if (!contractResp.path.Key) {
          res.status(500).json({ error: "can't upload image" });
          return;
        }
      }
      let onboardingObject = {
        brandName: req.body.brandName,
        brandLogo: logoResp ? logoResp.path.Key : "",
        restaurantType: req.body.restaurantType,
        menuList: menuListResp ? menuListResp.path.Key : "",
        menuItemsPhoto: menuItemsPhotoResp ? menuItemsPhotoResp.path.Key : "",
        nda: ndaResp ? ndaResp.path.Key : "",
        contract: contractResp ? contractResp.path.Key : "",
        vat: req.body.vat,
        status: "accepted",
        managementContactNo: req.body.managementContactNo,
        managementEmail: req.body.managementEmail,
        managementContactNoMarketing: req.body.managementContactNoMarketing,
        managementEmailMarketing: req.body.managementEmailMarketing,
        userStatus: [
          {
            enquiryStatus: {
              approved: true,
              submitted: true,
              correction: false,
            },
            onboardingStatus: {
              approved: false,
              submitted: true,
              correction: false,
            },
            cloudKitchenStatus: {
              approved: false,
              submitted: false,
              correction: false,
            },
          },
        ],
        branchTime: {
          branchTimeSlotStart: req.body.branchTime.branchTimeSlotStart,
          branchTimeSlotEnd: req.body.branchTime.branchTimeSlotEnd,
        },
      };
      let sData = await subscription.getById({ _id: req.body.subscription });
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
      onboardingObject.subscription = subsData;
      let result = await enquiry.update(
        { enquiryId: enquiryId },
        onboardingObject
      );
      if (result) {
        let obj = {
          type: "onboarding",
          name: data.Name,
        };
        let serviceRes = emailService.sendEmailNew(
          emailId,
          "Your onboarding form is being processed",
          obj
        );
        log.info("generating user ===== " + "success");
        log.info("email service response === " + serviceRes);
        res.status(200).json({ result: result });
      }
    } else {
      res.status(400).json({ error: "required request body" });
    }
  } else {
    res.status.json({ error: "data not found" });
  }
};

exports.getAllOnboardingData = async (req, res, next) => {
  let result = await enquiry.get({
    $or: [{ status: "accepted" }, { status: "rejected onboarding" }],
  });
  if (result) {
    res.status(200).json({ items: result });
  } else {
    res.status(400).json({ error: "data not found" });
  }
};

exports.getOnboardingDataById = async (req, res, next) => {
  if (req.params.enquiryId != null && req.params.enquiryId != undefined) {
    var enquiryId = parseInt(req.params.enquiryId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await enquiry.getById({
    enquiryId: enquiryId,
    status: "accepted",
  });
  if (result) {
    res.status(200).json({ item: result });
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

exports.approveOrRejectOnboarding = async (req, res, next) => {
  if (req.params.enquiryId != null && req.params.enquiryId != undefined) {
    var enquiryId = parseInt(req.params.enquiryId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await enquiry.getById({ enquiryId: enquiryId });
  if (result) {
    var emailId = result[0].emailId;
    result[0].status = req.body.status;
    result[0].onboardingRejection = req.body.onboardingRejection;
    if (req.body.status === "accepted") {
      let merchantId = generatePassword();
      result[0].userStatus[0].onboardingStatus[0].approved = "true";
      result[0].userStatus[0].cloudKitchenStatus[0].approved = "true";
      result[0].userStatus[0].cloudKitchenStatus[0].submitted = "true";
      result[0].onboardingRejection = "";
      result[0].status = "cloudKitchen";
      await enquiry.updateOne({ enquiryId: enquiryId }, result[0]);
      let kitchenId = await getKitchenNextSequence();
      let cloudKitchenObject = {
        kitchenName: result[0].brandName,
        kitchenLogo: result[0].brandLogo,
        kitchenDetails: result[0].restaurantType,
        kitchenDemographicDetails: result[0].city_branches,
        kitchenId: parseInt(kitchenId) + 1,
        kitchenEmail: result[0].emailId,
        subscription: result[0].subscription,
        publish: true,
        busy: "false",
        autoAssign: "false",
        merchantConfig: [
          {
            vendorId: 5,
            merchantId: merchantId,
            merchantLogo: result[0].brandLogo,
            merchantName: result[0].Name,
          },
        ],
      };
      await cloudKitchen.create(cloudKitchenObject);
      let userId = await getUserNextSequence();
      var user = {
        userId: parseInt(userId) + 1,
        emailId: result[0].emailId,
        password: result[0].password,
        role: "kitchen_admin",
        kitchenId: cloudKitchenObject.kitchenId,
        lisencekey: uuidv4(),
      };
      await User.create(user);
      var kitchenConfigObj = properties.defaultKitchenObject;
      kitchenConfigObj["kitchenId"] = cloudKitchenObject.kitchenId;
      kitchenConfigObj["userId"] = user.userId;
      await kitchenConfig.create(kitchenConfigObj);
      let obj = {
        type: "approved onboarding",
        name: result[0].Name,
        merchantId: merchantId,
        lisencekey: user.lisencekey,
        // loginlink: process.env.Login_IP + "/kitchin/login"
      };
      emailService.sendEmailNew(emailId, "Welcome User", obj);
      res.status(200).json({ message: "approved mail sent successfully" });
    } else if (req.body.status === "rejected") {
      let obj = {
        type: "refused onboarding",
        name: result[0].Name,
        onboardingRejection: req.body.onboardingRejection,
      };
      result[0].userStatus[0].onboardingStatus[0].correction = "true";
      result[0].userStatus[0].onboardingStatus[0].submitted = "true";
      result[0].userStatus[0].onboardingStatus[0].approved = "false";
      result[0].status = "rejected onboarding";
      await enquiry.updateOne({ enquiryId: enquiryId }, result[0]);
      emailService.sendEmailNew(result[0].emailId, "Welcome User", obj);
      res.status(200).json({ message: "refused mail sent successfully" });
    } else {
      result[0].status = "new";
      await enquiry.updateOne({ enquiryId: enquiryId }, result[0]);
      res.status(200).json({ message: "Status change to new" });
    }
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

function generatePassword() {
  var length = 4,
    charset = "0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

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

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateOTP() {
  var length = 4,
    charset = "0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

exports.getUserStatus = async (req, res, next) => {
  if (req.params.enquiryId != null && req.params.enquiryId != undefined) {
    var enquiryId = parseInt(req.params.enquiryId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await enquiry.getById({ enquiryId: enquiryId });
  if (result) {
    const data = result[0].userStatus;
    res.status(200).json({ data: data });
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

exports.assignEnquiry = async (req, res, next) => {
  if (req.params.enquiryId != null && req.params.enquiryId != undefined) {
    var enquiryId = parseInt(req.params.enquiryId);
    var assignedTo = parseInt(req.params.assignedTo);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await enquiry.getById({ enquiryId: enquiryId });
  if (result) {
    let user = await subAdmin.getById({ userId: assignedTo });
    if (user) {
      result[0].assignedTo = user.userId;
      await enquiry.updateOne({ enquiryId: enquiryId }, result[0]);
      res.status(200).json({ message: "Assigned successfully" });
    } else {
      res.status(400).json({ error: "No assignee found" });
    }
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

exports.uploadBankDetails = async (req, res, next) => {
  if (req.params._id != null && req.params._id != undefined) {
    var enquiryId = req.params._id;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await enquiry.getById({ _id: enquiryId });
  if (result) {
    let docResp = null;
    docResp = await s3ImageUpload(req.files.doc[0], `enquiryfile`);
    var enquiryObject = {};
    enquiryObject.bankDetailsUpload = docResp ? docResp.path.Key : "";
    let data = await enquiry.update({ _id: enquiryId }, enquiryObject);
    res.status(200).json({ data: data });
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};
// update vendor detail
// exports.updateEnquiry = async function(req, res, next) {
//     if (req.params.enquiryId != null && req.params.enquiryId != undefined) {
//         var enquiryId = parseInt(req.params.enquiryId);
//     } else {
//         res.status(400).json({ error: "request parameters required" });
//     }
//     let enquiryData = await enquiry.getOne({ enquiryId: req.params.enquiryId });
//     if (enquiryData) {
//         if (req.body !== null && req.body !== undefined) {
//             var newEnquiry = {
//                 vendorLogo: req.body.vendorLogo,
//                 licenseKey: req.body.licenseKey,
//                 webHookUrl: req.body.webHookUrl,
//             }
//             log.info("Updating vendor =====> ");
//             let result = await vendor.update({ "vendorId": vendorId }, newVendor);
//             if (result) {
//                 log.info(datetime + " === " + result);
//                 res.status(200).json({ message: "vendor updated successfully" });
//             } else {
//                 log.error(datetime + " === " + result);
//                 res.status(500).json({ error: "can't update vendor" });
//             }
//         } else {
//             res.status(400).json({ error: "request body required" });
//         }
//     } else {
//         res.status(400).json({ error: "vendor data not found" });
//     }
// }

//remove vendor
exports.removeEnquiry = async function (req, res) {
  if (req.params.enquiryId != null && req.params.enquiryId != undefined) {
    var enquiryId = parseInt(req.params.enquiryId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let enquiryData = await enquiry.getOne({ enquiryId: enquiryId });
  if (enquiryData) {
    let result = await enquiry.delete({ enquiryId: enquiryId });
    log.info("Vendor deletion started !");
    if (result) {
      res.status(200).json({ message: "Enquiry deleted successfully" });
    } else {
      res.status(500).json({ error: "can't delete enquiry" });
    }
  } else {
    res
      .status(400)
      .json({ error: "enquiry with this enquiryId does not exist!" });
  }
};

exports.exportDocument = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var exportType = req.params.exportType;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  try {
    let result = await enquiry.get({
      $or: [{ status: "new" }, { status: "rejected" }],
    });
    var filePath;
    const fileName = "enquiry";
    const fields = [
      "Name",
      "emailId",
      "mobileNumber",
      "webSite",
      "brandName",
      "cr_maroof",
      "designation",
      "dishes",
      "city_branches",
    ];
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
      // filePath = await exportDoc.getCSV(result, fields, fileName);
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
      filePath = await exportDoc.getPdf(result, fileName, "enquiry");
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

exports.exportMenuXLSX = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var exportType = req.params.exportType;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  try {
    // let result = await enquiry.get();
    var filePath;
    const fileName = "enquiry";
    const fields = {
      "S.No": "",
      menu_name: "",
      menu_category: "",
      menu_subCategory: "",
      menu_Preparation_Details: "",
      phase_name: "",
      "preparation Time": "",
      ingredients: "",
      quantity: "",
      units: "",
      chef: "",
      skills_Rating: "",
      vendor_Name: "",
      "vendor MenuId": "",
    };
    if (exportType === "xlsx") {
      // filePath = await exportDoc.getCSV(result, fields, fileName);
      filePath = await exportDoc.getMenuXLSX(fileName, fields);
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

exports.forgetPassword = async (req, res, next) => {
  try {
    if (req.body !== undefined && req.body !== null) {
      let user = await enquiry.getOne({ emailId: req.body.emailId });
      if (user) {
        let otp = generateOTP();
        let resetPassword = {
          emailId: user.emailId,
          OTP: otp,
        };
        // console.log(user.kitchenId, user.userId);
        let obj = {
          type: "resetpassword",
          name: user.Name,
          otp: otp,
          // loginlink: process.env.Login_IP + "/admin" + "/user/" + user.userId + "/resetpassword",
        };
        // console.log(obj.loginlink);
        let serviceRes = emailService.sendEmailNew(
          user.emailId,
          "Welcome User",
          obj
        );
        // log.info("generating user ===== " + user);
        log.info("email service response === " + serviceRes);
        res.status(200).json({
          message: "A reset link has been sent to your email",
          enquiryId: user.enquiryId,
        });
        let newData = await password.getOne({ emailId: req.body.emailId });
        if (newData) {
          await password.update({ emailId: req.body.emailId }, resetPassword);
        } else {
          await password.create(resetPassword);
        }
      } else {
        log.error(datetime + " === " + "error");
        res.status(200).json({ error: "User with this email does not exist" });
      }
    } else {
      res.status(400).json({ error: "required reuqest body" });
    }
  } catch (e) {
    console.error(e);
  }
};

exports.resetPassword = async (req, res, next) => {
  if (req.params.enquiryId != null && req.params.enquiryId != undefined) {
    var enquiryId = parseInt(req.params.enquiryId);
    // var otp = req.body.otp;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  if (req.body !== null && req.body !== undefined) {
    let user = await enquiry.getOne({ enquiryId: req.params.enquiryId });

    if (user) {
      let otpObj = await password.getOne({ emailId: user.emailId });
      // console.log("request" + req.body.otp);
      // console.log(otpObj.OTP);
      if (otpObj) {
        if (req.body.otp == null) {
          res.status(400).json({ error: "OTP is required" });
        } else {
          if (req.body.otp != otpObj.OTP) {
            log.info("OTP doesn't matched ===== ");
            res.status(400).json({ error: "OTP doesn't matched" });
          } else {
            if (req.body.confirmPassword == null) {
              res.status(400).json({ error: "confirm password is required" });
            } else {
              if (req.body.confirmPassword !== req.body.newPassword) {
                //console.log("confirm");
                log.info("confirm password doesn't matched ===== ");
                res
                  .status(400)
                  .json({ error: "confirm password doesn't matched" });
              } else {
                let updateKey = {
                  password: bcrypt.hashSync(req.body.newPassword, 10),
                };
                log.info("Updating onboard ===== ");
                let result = await enquiry.update(
                  { enquiryId: enquiryId },
                  updateKey
                );
                if (result) {
                  await password.deleteOne({ emailId: user.emailId });
                  res
                    .status(200)
                    .json({ message: "Password Updated successfully" });
                } else {
                  res.status(500).json({ error: "can't update password" });
                }
              }
            }
          }
        }
      } else {
        res.status(400).json({ error: "OTP has been expired" });
      }
    } else {
      res.status(400).json({ error: "user not found " });
    }
  } else {
    res.status(400).json({ error: "request body required" });
  }
};

// exports.updatePublish = async function(req, res, next) {
//     if (req.params.vendorId != null && req.params.vendorId != undefined) {
//         var vendorId = parseInt(req.params.vendorId);
//     } else {
//         res.status(400).json({ error: "request parameters required" });
//     }
//     log.info("updating publish===== ");
//     let vendorData = await vendor.getOne({ vendorId: vendorId });
//     if (vendorData) {
//         if (req.body !== null && req.body !== undefined) {
//             var updatePublishObject = {};
//             updatePublishObject.publish = req.body.publish;
//             let result = await vendor.update({ vendorId: vendorId }, updatePublishObject);
//             if (result) {
//                 log.info(datetime + " === " + "success");
//                 res.status(200).json({ message: "Vendor Publish Updated successfully" });
//             } else {
//                 log.error(datetime + " === " + "failure");
//                 res.status(500).json({ error: "can't update Publish" });
//             }
//         } else {
//             res.status(400).json({ error: "request body required" });
//         }
//     } else {
//         res.status(400).json({ error: "vendor data not found" })
//     }
// }

exports.updateenquiry = async (req, res, next) => {
  let result = await enquiry.updateMany(
    { _id: { $in: req?.body } },
    { $set: { isNewEnquiry: false } },
    { multi: true }
  );
  if (result) {
    res.status(200).json({ message: "Update successfully" });
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};
