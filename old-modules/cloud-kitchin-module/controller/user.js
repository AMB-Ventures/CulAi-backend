var userprofile = require("../doa/user");
var cloudkitchen = require("../doa/cloud_kitchen");
var Employee = require("../doa/employee");
var password = require("../doa/resetpassword");
var log = require("../logger");
var emailService = require("./email-sender");
var datetime = new Date();
var bcrypt = require("bcrypt");
var exportDoc = require("./export-documents");
var fs = require("fs");
const s3ImageUpload = require("./s3ImageUpload");

// userprofile getby userId etails
exports.getUserById = async (req, res, next) => {
  if (req.params.userId != null && req.params.userId != undefined) {
    var userId = req.params.userId;
    var kitchenId = req.params.kitchenId;
  } else {
    res.json({ error: "request parameters required" });
  }
  let result = await userprofile.getById({ userId: userId });
  let cData = await cloudkitchen.getById({ kitchenId: kitchenId });
  if (result) {
    res.status(200).json({ userprofile: result, cData: cData });
  } else {
    res.status(500).json({ error: "Id not found" });
  }
};

// update userprofile detail
exports.updateUser = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var userId = req.params.userId;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let userData = await userprofile.getOne({ userId: userId });
  if (userData) {
    if (req.body !== undefined && req.body !== null && req.body.data) {
      req.body = JSON.parse(req.body.data);
      let imageResp = null;
      if (req.file) {
        imageResp = await s3ImageUpload(req.file, `profilepic`);
        if (!imageResp.path.Key) {
          res.status(500).json({ error: "can't upload image" });
          return;
        }
      }
      var newuser = {
        name: req.body.name,
        details: req.body.details,
      };
      if (imageResp) newuser.profilePic = imageResp.path.Key;
      let result = await userprofile.update({ userId: userId }, newuser);
      if (result) {
        res.status(200).json({ message: "userprofile updated successfully" });
      } else {
        res.status(500).json({ error: "can't update userprofile" });
      }
    } else {
      res.status(400).json({ error: "request body required" });
    }
  } else {
    res.status(400).json({ error: "userprofile data not found" });
  }
};

exports.updatePassword = async (req, res, next) => {
  if (req.params.userId != null && req.params.userId != undefined) {
    var userId = parseInt(req.params.userId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  if (req.body !== null && req.body !== undefined) {
    let user = await userprofile.getOne({ userId: req.params.userId });
    if (user) {
      // if (!bcrypt.compareSync(req.body.currentPassword, user.password)) {
      //     log.info("current password doesn't matched ===== ");
      //     res.status(400).json({ error: "current password doesn't matched" });
      // } else {
      if (req.body.confirmPassword == null) {
        res.status(400).json({ error: "confirm password is required" });
      } else {
        if (req.body.confirmPassword !== req.body.newPassword) {
          //console.log("confirm");
          log.info("confirm password doesn't matched ===== ");
          res.status(400).json({ error: "confirm password doesn't matched" });
        } else {
          let updateKey = {
            password: bcrypt.hashSync(req.body.newPassword, 10),
          };
          log.info("Updating onboard ===== ");
          let result = await userprofile.update({ userId: userId }, updateKey);
          if (result) {
            res.status(200).json({ message: "Password Updated successfully" });
          } else {
            res.status(500).json({ error: "can't update password" });
          }
        }
      }
      // }
    } else {
      res.status(400).json({ error: "user not found " });
    }
  } else {
    res.status(400).json({ error: "request body required" });
  }
};

exports.exportDocument = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var exportType = JSON.parse(req.params.exportType);
    var kitchenId = req.params.kitchenId;
    var userId = req.params.userId;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  try {
    let result = await userprofile.get({
      userId: userId,
      kitchenId: kitchenId,
    });
    var filePath;
    const fileName = kitchenId + "_" + userId + "userprofile";
    const fields = [
      "userId",
      "emailId",
      "role",
      "kitchenId",
      "name",
      "details",
      "lisencekey",
      "updatedBy",
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
      filePath = await exportDoc.getPdf(result, fileName, "userprofile");
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
      let user = await userprofile.getOne({ emailId: req.body.emailId });
      if (user) {
        let otp = generateOTP();
        let resetPassword = {
          emailId: user.emailId,
          OTP: otp,
        };
        // console.log(user.kitchenId, user.userId);
        let obj = {
          type: "resetpassword",
          name: user.name,
          otp: otp,
          loginlink:
            "http://15.184.200.57/" +
            user.kitchenId +
            "/user/" +
            user.userId +
            "/resetpassword",
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
          kitchenId: user.kitchenId,
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
        res.status(200).json({ error: "User with this email does not exist" });
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
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  if (req.body !== null && req.body !== undefined) {
    let user = await userprofile.getOne({ userId: req.params.userId });

    if (user) {
      let otpObj = await password.getOne({ emailId: user.emailId });
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
                log.info("confirm password doesn't matched ===== ");
                res
                  .status(400)
                  .json({ error: "confirm password doesn't matched" });
              } else {
                let updateKey = {
                  password: bcrypt.hashSync(req.body.newPassword, 10),
                };
                log.info("Updating onboard ===== ");
                let result = await userprofile.update(
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
