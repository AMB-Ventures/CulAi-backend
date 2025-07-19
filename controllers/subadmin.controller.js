var subAdmin = require("../doa/subadmin.doa");
var password = require("../doa/resetpassword.doa");
// var cloudKitchen = require('../doa/cloud_kitchen');
var bcrypt = require("bcrypt");
var exportDoc = require("./export-documents.controller");
var emailService = require("./email-sender.controller");
var log = require("../logger");
var fs = require("fs");
var datetime = new Date();

exports.createSubAdmin = async (req, res, next) => {
  try {
    if (req.body !== undefined && req.body !== null) {
      let emailId = req.body.emailId.toLowerCase();
      let data = await subAdmin.getOne({ emailId: emailId });
      if (data) {
        res.status(500).json({ error: "subadmin is already exist." });
      } else {
        let otp = generatePassword();
        var Id = await getNextSequence();
        var subAdminObject = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          emailId: emailId,
          userId: parseInt(Id) + 1,
          role: "sub_admin",
          password: bcrypt.hashSync(otp, 10),
          status: "false",
          cloudKitchens: req.body.cloudKitchens,
          accessControl: {
            Registration: {
              all: false,
              add: false,
              edit: false,
              delete: false,
              view: false,
            },
            CloudKitchens: {
              all: false,
              add: false,
              edit: false,
              delete: false,
              view: false,
            },
            Vendor: {
              all: false,
              add: false,
              edit: false,
              delete: false,
              view: false,
            },
            CuisineType: {
              all: false,
              add: false,
              edit: false,
              delete: false,
              view: false,
            },
            SubCuisineType: {
              all: false,
              add: false,
              edit: false,
              delete: false,
              view: false,
            },
            Settings: {
              all: false,
              add: false,
              edit: false,
              delete: false,
              view: false,
            },
            Features: {
              all: false,
              add: false,
              edit: false,
              delete: false,
              view: false,
            },
            Subscription: {
              all: false,
              add: false,
              edit: false,
              delete: false,
              view: false,
            },
            Onboarding: {
              all: false,
              add: false,
              edit: false,
              delete: false,
              view: false,
            },
            Newsletter: {
              all: false,
              add: false,
              edit: false,
              delete: false,
              view: false,
            },
          },
        };
        let obj = {
          type: "subadmin",
          name: subAdminObject.firstName,
          role: subAdminObject.role,
          email: subAdminObject.emailId,
          password: otp,
          loginlink: "https://admin-uat.cloudkitchen.com/",
        };
        let serviceRes = emailService.sendEmailNew(
          subAdminObject.emailId,
          "welcome user",
          obj
        );
        if (serviceRes) {
          log.info(datetime + " === " + "success");
          res.status(200).json({
            message: "subadmin created successfully ",
          });
          let result = await subAdmin.create(subAdminObject);
          log.info("generating user ===== " + result);
          log.info("email service response === " + serviceRes);
        } else {
          log.error(datetime + " === " + "failure");
          res.status(500).json({ error: "unhadled error" });
        }
      }
    } else {
      res.status(400).json({ error: "required reuqest body" });
    }
  } catch (e) {
    console.error(e);
  }
};

function getNextSequence() {
  return new Promise((resolve) => {
    return subAdmin
      .findOne()
      .sort([["userId", "descending"]])
      .limit(1)
      .exec((err, subadmin) => {
        if (subadmin != null) {
          if (subadmin.userId != undefined) {
            return resolve(subadmin.userId);
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

//get all subadmin
exports.getSubAdmins = async (req, res, next) => {
  let result = await subAdmin.get();
  if (result) {
    res.status(200).json({ items: result });
  } else {
    res.status(400).json({ error: "data not found" });
  }
};

// subadmin getby userId etails
exports.getSubAdminbyId = async (req, res, next) => {
  if (req.params.userId != null && req.params.userId != undefined) {
    var userId = parseInt(req.params.userId);
    console.log(userId, req.params.userId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await subAdmin.getById({ userId: userId });
  console.log(result);
  if (result) {
    res.status(200).json({ subadmin: result });
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

// update subadmin detail
exports.updateSubAdmin = async (req, res, next) => {
  if (req.params.userId != null && req.params.userId != undefined) {
    var userId = parseInt(req.params.userId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let user = await subAdmin.getOne({ userId: req.params.userId });
  if (user) {
    if (req.body !== null && req.body !== undefined) {
      var newSubAdmin = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        status: req.body.status,
        cloudKitchens: req.body.cloudKitchens,
        accessControl: {
          Registration: {
            all: req.body.accessControl.Registration?.all ?? false,
            add: req.body.accessControl.Registration?.add ?? false,
            edit: req.body.accessControl.Registration?.edit ?? false,
            delete: req.body.accessControl.Registration?.delete ?? false,
            view: req.body.accessControl.Registration?.view ?? false,
          },
          CloudKitchens: {
            all: req.body.accessControl.CloudKitchens?.all ?? false,
            add: req.body.accessControl.CloudKitchens?.add ?? false,
            edit: req.body.accessControl.CloudKitchens?.edit ?? false,
            delete: req.body.accessControl.CloudKitchens?.delete ?? false,
            view: req.body.accessControl.CloudKitchens?.view ?? false,
          },
          Vendor: {
            all: req.body.accessControl.Vendor?.all ?? false,
            add: req.body.accessControl.Vendor?.add ?? false,
            edit: req.body.accessControl.Vendor?.edit ?? false,
            delete: req.body.accessControl.Vendor?.delete ?? false,
            view: req.body.accessControl.Vendor?.view ?? false,
          },
          CuisineType: {
            all: req.body.accessControl.CuisineType?.all ?? false,
            add: req.body.accessControl.CuisineType?.add ?? false,
            edit: req.body.accessControl.CuisineType?.edit ?? false,
            delete: req.body.accessControl.CuisineType?.delete ?? false,
            view: req.body.accessControl.CuisineType?.view ?? false,
          },
          SubCuisineType: {
            all: req.body.accessControl.SubCuisineType?.all ?? false,
            add: req.body.accessControl.SubCuisineType?.add ?? false,
            edit: req.body.accessControl.SubCuisineType?.edit ?? false,
            delete: req.body.accessControl.SubCuisineType?.delete ?? false,
            view: req.body.accessControl.SubCuisineType?.view ?? false,
          },
          Settings: {
            all: req.body.accessControl.Settings?.all ?? false,
            add: req.body.accessControl.Settings?.add ?? false,
            edit: req.body.accessControl.Settings?.edit ?? false,
            delete: req.body.accessControl.Settings?.delete ?? false,
            view: req.body.accessControl.Settings?.view ?? false,
          },
          Features: {
            all: req.body.accessControl.Features?.all ?? false,
            add: req.body.accessControl.Features?.add ?? false,
            edit: req.body.accessControl.Features?.edit ?? false,
            delete: req.body.accessControl.Features?.delete ?? false,
            view: req.body.accessControl.Features?.view ?? false,
          },
          Subscription: {
            all: req.body.accessControl.Subscription?.all ?? false,
            add: req.body.accessControl.Subscription?.add ?? false,
            edit: req.body.accessControl.Subscription?.edit ?? false,
            delete: req.body.accessControl.Subscription?.delete ?? false,
            view: req.body.accessControl.Subscription?.view ?? false,
          },
          Onboarding: {
            all: req.body.accessControl.Onboarding?.all ?? false,
            add: req.body.accessControl.Onboarding?.add ?? false,
            edit: req.body.accessControl.Onboarding?.edit ?? false,
            delete: req.body.accessControl.Onboarding?.delete ?? false,
            view: req.body.accessControl.Onboarding?.view ?? false,
          },
          Newsletter: {
            all: req.body.accessControl.Newsletter?.all ?? false,
            add: req.body.accessControl.Newsletter?.add ?? false,
            edit: req.body.accessControl.Newsletter?.edit ?? false,
            delete: req.body.accessControl.Newsletter?.delete ?? false,
            view: req.body.accessControl.Newsletter?.view ?? false,
          },
        },
      };
      log.info("Updating subadmin =====> ");
      let result = await subAdmin.update({ userId: userId }, newSubAdmin);
      if (result) {
        res.status(200).json({ message: "subadmin updated successfully" });
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

exports.updateSubadminAccessControl = async (req, res, next) => {
  const userIds = req.body.userIds ?? [];
  const accessControl = {
    Registration: {
      all: req.body.accessControl.Registration?.all ?? false,
      add: req.body.accessControl.Registration?.add ?? false,
      edit: req.body.accessControl.Registration?.edit ?? false,
      delete: req.body.accessControl.Registration?.delete ?? false,
      view: req.body.accessControl.Registration?.view ?? false,
    },
    CloudKitchens: {
      all: req.body.accessControl.CloudKitchens?.all ?? false,
      add: req.body.accessControl.CloudKitchens?.add ?? false,
      edit: req.body.accessControl.CloudKitchens?.edit ?? false,
      delete: req.body.accessControl.CloudKitchens?.delete ?? false,
      view: req.body.accessControl.CloudKitchens?.view ?? false,
    },
    Vendor: {
      all: req.body.accessControl.Vendor?.all ?? false,
      add: req.body.accessControl.Vendor?.add ?? false,
      edit: req.body.accessControl.Vendor?.edit ?? false,
      delete: req.body.accessControl.Vendor?.delete ?? false,
      view: req.body.accessControl.Vendor?.view ?? false,
    },
    CuisineType: {
      all: req.body.accessControl.CuisineType?.all ?? false,
      add: req.body.accessControl.CuisineType?.add ?? false,
      edit: req.body.accessControl.CuisineType?.edit ?? false,
      delete: req.body.accessControl.CuisineType?.delete ?? false,
      view: req.body.accessControl.CuisineType?.view ?? false,
    },
    SubCuisineType: {
      all: req.body.accessControl.SubCuisineType?.all ?? false,
      add: req.body.accessControl.SubCuisineType?.add ?? false,
      edit: req.body.accessControl.SubCuisineType?.edit ?? false,
      delete: req.body.accessControl.SubCuisineType?.delete ?? false,
      view: req.body.accessControl.SubCuisineType?.view ?? false,
    },
    Settings: {
      all: req.body.accessControl.Settings?.all ?? false,
      add: req.body.accessControl.Settings?.add ?? false,
      edit: req.body.accessControl.Settings?.edit ?? false,
      delete: req.body.accessControl.Settings?.delete ?? false,
      view: req.body.accessControl.Settings?.view ?? false,
    },
    Features: {
      all: req.body.accessControl.Features?.all ?? false,
      add: req.body.accessControl.Features?.add ?? false,
      edit: req.body.accessControl.Features?.edit ?? false,
      delete: req.body.accessControl.Features?.delete ?? false,
      view: req.body.accessControl.Features?.view ?? false,
    },
    Subscription: {
      all: req.body.accessControl.Subscription?.all ?? false,
      add: req.body.accessControl.Subscription?.add ?? false,
      edit: req.body.accessControl.Subscription?.edit ?? false,
      delete: req.body.accessControl.Subscription?.delete ?? false,
      view: req.body.accessControl.Subscription?.view ?? false,
    },
    Onboarding: {
      all: req.body.accessControl.Onboarding?.all ?? false,
      add: req.body.accessControl.Onboarding?.add ?? false,
      edit: req.body.accessControl.Onboarding?.edit ?? false,
      delete: req.body.accessControl.Onboarding?.delete ?? false,
      view: req.body.accessControl.Onboarding?.view ?? false,
    },
    Newsletter: {
      all: req.body.accessControl.Newsletter?.all ?? false,
      add: req.body.accessControl.Newsletter?.add ?? false,
      edit: req.body.accessControl.Newsletter?.edit ?? false,
      delete: req.body.accessControl.Newsletter?.delete ?? false,
      view: req.body.accessControl.Newsletter?.view ?? false,
    },
  };
  let operations = await subAdmin.updateMany(
    { userId: { $in: userIds } },
    { $set: { accessControl: accessControl } }
  );
  if (operations) {
    res.status(200).json({ message: "User updated successfully" });
  } else {
    res.status(200).json({ error: "Error while updating User" });
  }
};
//remove subadmin
exports.removeSubAdmin = async function (req, res) {
  if (req.params.userId != null && req.params.userId != undefined) {
    var userId = parseInt(req.params.userId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let user = await subAdmin.getOne({ userId: userId });
  if (user) {
    let result = await subAdmin.delete({ userId: userId });
    log.info("subadmin deletion started !");
    if (result) {
      res.status(200).json({ message: "subadmin deleted successfully" });
    } else {
      res.status(400).json({ error: "Id not found" });
    }
  } else {
    res
      .status(400)
      .json({ error: "subadmin with this userId does not exist!" });
  }
};

exports.updateStatus = async (req, res, next) => {
  if (req.params.userId != null && req.params.userId != undefined) {
    var userId = parseInt(req.params.userId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  log.info("updating status===== ");
  let user = await subAdmin.getOne({ userId: userId });
  if (user) {
    if (req.body !== null && req.body !== undefined) {
      var updateStatusObject = {};
      updateStatusObject.status = req.body.status;
      let result = await subAdmin.update(
        { userId: userId },
        updateStatusObject
      );
      if (result) {
        res
          .status(200)
          .json({ message: "Subadmin Status Updated successfully" });
      } else {
        res.status(500).json({ error: "can't update status" });
      }
    } else {
      res.status(400).json({ error: "request body required" });
    }
  } else {
    res.status(400).json({ error: "user not found" });
  }
};

//update user password from otp.
exports.updatePassword = async (req, res, next) => {
  if (req.params.userId != null && req.params.userId != undefined) {
    var userId = parseInt(req.params.userId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  if (req.body !== null && req.body !== undefined) {
    let user = await subAdmin.getOne({ userId: req.params.userId });
    if (user) {
      if (req.body.confirmPassword == null) {
        res.status(400).json({ error: "confirm password is required hello" });
      } else {
        if (req.body.confirmPassword !== req.body.newPassword) {
          log.info("confirm password doesn't matched ===== ");
          res.status(400).json({ error: "confirm password doesn't matched" });
        } else {
          let updateKey = {
            password: bcrypt.hashSync(req.body.newPassword, 10),
          };
          log.info("Updating onboard ===== ");
          let result = await subAdmin.update({ userId: userId }, updateKey);
          if (result) {
            log.info(datetime + " === " + result);
            res.status(200).json({ message: "Password Updated successfully" });
          } else {
            log.error(datetime + " === " + result);
            res.status(500).json({ error: "can't update password" });
          }
        }
      }
    } else {
      res.status(400).json({ error: "user not found " });
    }
  } else {
    res.status(400).json({ error: "request body required" });
  }
};

exports.exportDocument = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var exportType = req.params.exportType;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  try {
    let result = await subAdmin.get();
    var filePath;
    const fileName = "subAdmin";
    const fields = [
      "firstName",
      "lastName",
      "status",
      "emailId",
      "role",
      "cloudKitchens",
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
      filePath = await exportDoc.getPdf(result, fileName, "subadmin");
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

// exports.forgetPassword = async (req, res, next) => {
//     try {
//         if (req.body !== undefined && req.body !== null) {
//             let user = await subAdmin.getOne({ emailId: req.body.emailId });
//             if (user) {
//                 // console.log(user.kitchenId, user.userId);
//                 let obj = {
//                     type: 'resetpassword',
//                     loginlink: "http://15.185.206.228/subadmin/" + user.userId + "/reset-password",
//                 }
//                 console.log(obj.loginlink);
//                 let serviceRes = emailService.sendEmailNew(user.emailId, 'Welcome User', obj);
//                 // log.info("generating user ===== " + user);
//                 log.info("email service response === " + serviceRes);
//                 res.status(200).json({ message: "A reset link has been sent to your email" });
//             } else {
//                 log.error(datetime + " === " + "error");
//                 res.status(500).json({ error: "user not found" });
//             }
//         } else {
//             res.status(400).json({ error: "required reuqest body" });
//         }
//     } catch (e) {
//         console.error(e)
//     }
// }

exports.forgetPassword = async (req, res, next) => {
  try {
    if (req.body !== undefined && req.body !== null) {
      let user = await subAdmin.getOne({ emailId: req.body.emailId });
      if (user) {
        let otp = generateOTP();
        let resetPassword = {
          emailId: user.emailId,
          OTP: otp,
        };
        // console.log(user.kitchenId, user.userId);
        let obj = {
          type: "resetpassword",
          name: user.firstName,
          otp: otp,
          // loginlink: process.env.Login_IP + "/admin" + "/user/" + user.userId + "/resetpassword",
        };
        console.log(obj.loginlink);
        let serviceRes = emailService.sendEmailNew(
          user.emailId,
          "Welcome User",
          obj
        );
        // log.info("generating user ===== " + user);
        log.info("email service response === " + serviceRes);
        res.status(200).json({
          message: "A reset link has been sent to your email",
          userId: user.userId,
        });
        let newData = await password.getOne({ emailId: req.body.emailId });
        if (newData) {
          await password.update({ emailId: req.body.emailId }, resetPassword);
        } else {
          await password.create(resetPassword);
        }
      } else {
        log.error(datetime + " === " + "error");
        res.status(200).json({ error: "user not found" });
      }
    } else {
      res.status(400).json({ error: "required reuqest body" });
    }
  } catch (e) {
    console.error(e);
  }
};

function generateOTP() {
  var length = 4,
    charset = "0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

exports.resetPassword = async (req, res, next) => {
  if (req.params.userId != null && req.params.userId != undefined) {
    var userId = parseInt(req.params.userId);
    // var otp = req.body.otp;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  if (req.body !== null && req.body !== undefined) {
    let user = await subAdmin.getOne({ userId: req.params.userId });

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
                let result = await subAdmin.update(
                  { userId: userId },
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
