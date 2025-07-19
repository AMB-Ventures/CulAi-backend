var Employee = require("../doa/employee");
var User = require("../doa/user");
var bcrypt = require("bcrypt");
var shift = require("../doa/shift");
var emailService = require("./email-sender");
var log = require("../logger");
var datetime = new Date();
var exportDoc = require("./export-documents");
var fs = require("fs");
var cloudKitchen = require("../doa/cloud_kitchen");

//create employee
exports.createEmployee = async (req, res, next) => {
  try {
    var adminId;
    var kitchenId;
    if (req.params != null && req.params != undefined) {
      adminId = req.params.adminId;
      kitchenId = req.params.kitchenId;
    } else return res.json({ error: "request parameters required" });
    if (req.body !== undefined && req.body !== null) {
      let kitchen = await cloudKitchen.getById({ kitchenId: kitchenId });
      if (!kitchen)
        return res.status(400).json({ error: "kitchen not fonund" });
      if (kitchen?.subscription.features) {
        let specificFeature = kitchen.subscription.features.find((j) => {
          if (j._id?.featureConstant === "no_of_employees") return j;
        });
        if (specificFeature) {
          let employees = await Employee.get({ kitchenId: kitchenId });
          if (employees.length < specificFeature.count) {
            let employee = await Employee.getOne({ emailId: req.body.emailId });
            if (employee)
              return res
                .status(500)
                .json({ error: "Employee with this email already exists." });
            else {
              if (req.body.role.includes("chef")) {
                if (req.body.employeeConfig == null) {
                  res.json({ error: "request body required" });
                } else {
                  let otp = generatePassword();
                  let emailId = req.body.emailId.toLowerCase();
                  let employeeId = await getNextSequence();
                  var employeeObj = req.body;
                  employeeObj.employeeId = parseInt(employeeId) + 1;
                  employeeObj.emailId = emailId;
                  employeeObj.adminId = adminId;
                  employeeObj.kitchenId = kitchenId;
                  employeeObj.schedule = req.body.schedule;
                  let results = await Employee.create(employeeObj);
                  if (results) {
                    let message = "employee added successfully";
                    res.status(200).json({ message });
                    let user = await User.getOne({ userId: req.body.userId });
                    if (user)
                      return res.status(500).json({
                        error:
                          "User with this userId already exist.Team will get back to you soon !",
                      });
                    else {
                      let otp = generatePassword();
                      let userId = await getUserNextSequence();
                      console.log(userId, parseInt(userId) + 1);
                      var userObj = {
                        userId: parseInt(userId) + 1,
                        emailId: emailId,
                        name: req.body.Name,
                        password: bcrypt.hashSync(otp, 10),
                        role: req.body.role,
                        kitchenId: employeeObj.kitchenId,
                      };
                      let obj = {
                        type: "employee",
                        name: employeeObj.Name,
                        role: employeeObj.role,
                        email: userObj.emailId,
                        password: otp,
                        loginlink: process.env.Login_IP + "/kitchin/login",
                      };
                      let serviceRes = emailService.sendEmailNew(
                        userObj.emailId,
                        "Welcome User",
                        obj
                      );
                      log.info("generating user ===== " + userObj);
                      log.info("email service response === " + serviceRes);
                      await User.create(userObj);
                    }
                  } else {
                    log.error(datetime + " === " + results);
                    res.status(500).json({ error: "employee not added" });
                  }
                }
              } else {
                let emailId = req.body.emailId.toLowerCase();
                let employeeId = await getNextSequence();
                var employeeObj = req.body;
                employeeObj.employeeId = parseInt(employeeId) + 1;
                employeeObj.emailId = emailId;
                employeeObj.adminId = adminId;
                employeeObj.kitchenId = kitchenId;
                employeeObj.schedule = req.body.schedule;
                let results = await Employee.create(employeeObj);
                if (results) {
                  let message = "employee added successfully";
                  res.status(200).json({ message });
                  let user = await User.getOne({ userId: req.body.userId });
                  if (user) {
                    res.status(500).json({
                      error:
                        "User with this userId already exist.Team will get back to you soon !",
                    });
                  } else {
                    let otp = generatePassword();
                    let userId = await getUserNextSequence();
                    console.log(userId, parseInt(userId) + 1);
                    var userObj = {
                      userId: parseInt(userId) + 1,
                      name: req.body.Name,
                      emailId: emailId,
                      password: bcrypt.hashSync(otp, 10),
                      role: req.body.role,
                      kitchenId: employeeObj.kitchenId,
                    };
                    let obj = {
                      type: "employee",
                      name: employeeObj.Name,
                      role: employeeObj.role,
                      email: userObj.emailId,
                      password: otp,
                      loginlink: process.env.Login_IP + "/kitchin/login",
                    };
                    let serviceRes = emailService.sendEmailNew(
                      userObj.emailId,
                      "Welcome User",
                      obj
                    );
                    log.info("generating user ===== " + userObj);
                    log.info("email service response === " + serviceRes);
                    await User.create(userObj);
                  }
                } else {
                  log.error(datetime + " === " + results);
                  res.status(500).json({ error: "employee not added" });
                }
              }
            }
          } else {
            return res
              .status(400)
              .json({ error: "Upgrade your Subscription. Limit exceed!" });
          }
        } else {
          return res
            .status(400)
            .json({ error: "Upgrade your Subscription. Limit exceed!" });
        }
      } else {
        return res
          .status(400)
          .json({ error: "Upgrade your Subscription. Limit exceed!" });
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
    return Employee.findOne()
      .sort([["employeeId", "descending"]])
      .limit(1)
      .exec((err, data) => {
        if (data != null) {
          if (data.employeeId != undefined) {
            return resolve(data.employeeId);
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

//get all the employee's details present
exports.getEmployees = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var kitchenId = req.params.kitchenId;
    // var adminId = req.params.adminId;
  } else {
    res.json({ error: "request parameters required" });
  }
  let result = await Employee.get({ kitchenId: kitchenId });
  if (result) {
    res.status(200).json({ employees: result });
  } else {
    res.status(400).json({ error: "data not found" });
  }
};

exports.getNameByRole = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var kitchenId = req.params.kitchenId;
    var role = req.params.role;
  } else {
    res.json({ error: "request parameters required" });
  }
  let result = await Employee.getName({ kitchenId: kitchenId, role: role });
  if (result) {
    res.status(200).json({ employees: result });
  } else {
    res.status(400).json({ error: "data not found" });
  }
};

//get category details based on employee name.
exports.getEmployeeById = async (req, res, next) => {
  if (req.params.employeeId != null && req.params.employeeId != undefined) {
    var employeeId = parseInt(req.params.employeeId);
    var kitchenId = req.params.kitchenId;
    var adminId = req.params.adminId;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await Employee.getById({
    adminId: adminId,
    kitchenId: kitchenId,
    employeeId: employeeId,
  });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

exports.getEmployeesByRole = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var kitchenId = req.params.kitchenId;
    var adminId = req.params.adminId;
    var role = req.params.role;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await Employee.get({
    adminId: adminId,
    kitchenId: kitchenId,
    role: role,
  });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

exports.getAccessControlList = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var kitchenId = req.params.kitchenId;
    var employeeId = req.params.employeeId;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await Employee.getList({
    employeeId: employeeId,
    kitchenId: kitchenId,
  });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

exports.updateEmployeeAccessControl = async (req, res, next) => {
  const employeeIds = req.body.employeeIds ?? [];
  const accessControl = {
    order: {
      add: req.body.accessControl.order?.add ?? false,
      edit: req.body.accessControl.order?.edit ?? false,
      delete: req.body.accessControl.order?.delete ?? false,
      view: req.body.accessControl.order?.view ?? false,
    },
    menu: {
      add: req.body.accessControl.menu?.add ?? false,
      edit: req.body.accessControl.menu?.edit ?? false,
      delete: req.body.accessControl.menu?.delete ?? false,
      view: req.body.accessControl.menu?.view ?? false,
    },
    settings: {
      add: req.body.accessControl.settings?.add ?? false,
      edit: req.body.accessControl.settings?.edit ?? false,
      delete: req.body.accessControl.settings?.delete ?? false,
      view: req.body.accessControl.settings?.view ?? false,
    },
    kpireports: {
      add: req.body.accessControl.kpireports?.add ?? false,
      edit: req.body.accessControl.kpireports?.edit ?? false,
      delete: req.body.accessControl.kpireports?.delete ?? false,
      view: req.body.accessControl.kpireports?.view ?? false,
    },
    reports: {
      add: req.body.accessControl.reports.add ?? false,
      edit: req.body.accessControl.reports.edit ?? false,
      delete: req.body.accessControl.reports.delete ?? false,
      view: req.body.accessControl.reports.view ?? false,
    },
  };
  let operations = await Employee.updateMany(
    { employeeId: { $in: employeeIds } },
    { $set: { accessControl: accessControl } }
  );
  if (operations) {
    res.status(200).json({ message: "Employee updated successfully" });
  } else {
    res.status(200).json({ error: "Error while updating Employee" });
  }
};

//update employee detail
exports.updateEmployee = async (req, res, next) => {
  if (req.params.employeeId != null && req.params.employeeId != undefined) {
    var employeeId = parseInt(req.params.employeeId);
    var kitchenId = req.params.kitchenId;
    var adminId = req.params.adminId;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let user = await Employee.getOne({
    employeeId: employeeId,
    kitchenId: kitchenId,
    adminId: adminId,
  });
  if (user) {
    if (req.body !== null && req.body !== undefined) {
      var email = user.emailId;
      let employee = await Employee.getOne({
        emailId: req.body.emailId,
        employeeId: { $ne: employeeId },
      });
      if (employee) {
        res.status(500).json({
          error:
            "Employee with this Email already exist.Team will get back to you soon !",
        });
      } else {
        log.info("Updating Employee ===== ");
        if (req.body.schedule) {
          let result = await Employee.getShifts({
            kitchenId: kitchenId,
            adminId: adminId,
            employeeId: { $eq: employeeId },
          });
          let schedule = result[0].schedule;
          Object.keys(JSON.parse(JSON.stringify(schedule))).forEach(
            (element) => {
              schedule[element] = schedule[element].map((j) => {
                return j._id;
              });
            }
          );
          Object.keys(JSON.parse(JSON.stringify(req.body.schedule))).forEach(
            function (key) {
              if (req?.body?.schedule[key])
                schedule[key] = req.body.schedule[key];
            }
          );
          req.body.schedule = schedule;
        }
        let result = await Employee.updateOne(
          { employeeId: employeeId, kitchenId: kitchenId, adminId: adminId },
          req.body
        );
        if (result) {
          if (req.body.emailId) {
            var newuser = req.body;
            await User.update({ emailId: email }, newuser);
          }
          res.status(200).json({ message: "Employee updated successfully" });
        } else {
          res.status(500).json({ error: "can't update Employee" });
        }
      }
    } else {
      res.status(400).json({ error: "request body required" });
    }
  } else {
    res.status(400).json({ error: "user not found" });
  }
};

//remove employee
exports.removeEmployee = async (req, res, next) => {
  if (req.params.employeeId != null && req.params.employeeId != undefined) {
    var employeeId = parseInt(req.params.employeeId);
    var adminId = parseInt(req.params.adminId);
    var emailId = req.params.emailId;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let user = await Employee.getOne({ employeeId: employeeId });
  if (user) {
    let result = await Employee.delete({
      employeeId: employeeId,
      adminId: adminId,
    });
    log.info("employee deletion started !");
    if (result) {
      log.info(datetime + " === " + result);
      log.info("user deletion started !");
      let data = await User.getOne({ emailId: emailId });
      if (data) {
        await User.delete({ emailId: emailId });
        res.status(200).json({ message: "Employee deleted successfully" });
      }
    } else {
      res.status(400).json({ error: "Id not found" });
    }
  } else {
    res.status(500).json({ error: "Employee with this Email does not exist!" });
  }
};
// exports.exportDocument = async (req, res, next) => {
//     if (req.params != null && req.params != undefined) {
//         var exportType = req.params.exportType;
//         var kitchenId = req.params.kitchenId;
//         var adminId = req.params.adminId;
//     } else {
//         res.status(400).json({ error: "request parameters required" });
//     }
//     try {
//         let result = await Employee.get({ "adminId": adminId, "kitchenId": kitchenId });
//         var filePath;
//         const fileName = kitchenId + "_" + adminId + "Employee";
//         const fields = ['kitchenId', 'adminId', 'Name', 'emailId', 'mobileNumber', 'role', 'employeeConfig', 'schedule', 'accessControl'];
//         if (exportType === "csv") {
//             filePath = await exportDoc.getCSV(result, fields, fileName);
//             res.download(filePath, function (err) {
//                 if (err) {
//                     console.log(err);
//                 }
//                 fs.unlink(filePath, function () {
//                     console.log("File was deleted")
//                 });
//             });
//             return "successfully downloaded";
//         } else if (exportType === "xlsx") {
//             filePath = await exportDoc.getXLSX(result, fields, fileName);
//             res.download(filePath, function (err) {
//                 if (err) {
//                     console.log(err);
//                 }
//                 fs.unlink(filePath, function () {
//                     console.log("File was deleted")
//                 });
//             });
//             return "successfully downloaded";
//         } else if (exportType === "pdf") {
//             filePath = await exportDoc.getPdf(result, fileName, 'Employee');
//             res.download(filePath, function (err) {
//                 if (err) {
//                     console.log(err);
//                 }
//                 fs.unlink(filePath, function () {
//                     console.log("File was deleted")
//                 });
//             });
//             return "successfully downloaded";
//         } else {
//             console.log("Unsupported File Type")
//         }
//     } catch (err) {
//         console.error(err);
//     }
// }

exports.exportDocument = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    console.log("req.params.exportType ----" + req.params.exportType);
    var exportType = req.params.exportType;
    var kitchenId = req.params.kitchenId;
    var adminId = req.params.adminId;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  try {
    let result = await Employee.getSpecific({
      adminId: adminId,
      kitchenId: kitchenId,
    });
    var filePath;
    const fileName = kitchenId + "_" + adminId + "employee";
    const fields = [
      "kitchenId",
      "adminId",
      "Name",
      "emailId",
      "mobileNumber",
      "role",
    ];
    if (exportType == "csv") {
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
    } else if (exportType == "xlsx") {
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
    } else if (exportType == "pdf") {
      filePath = await exportDoc.getPdf(result, fields, "employee");
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

exports.updatePassword = async (req, res, next) => {
  if (req.params.employeeId != null && req.params.employeeId != undefined) {
    var employeeId = parseInt(req.params.employeeId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  try {
    if (req.body !== null && req.body !== undefined) {
      let user = await Employee.getOne({ employeeId: req.params.employeeId });
      if (user) {
        if (!bcrypt.compareSync(req.body.currentPassword, user.password)) {
          log.info("current password doesn't matched ===== ");
          res.status(400).json({ error: "current password doesn't matched" });
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
              let result = await Employee.update(
                { employeeId: employeeId },
                updateKey
              );
              if (result) {
                res
                  .status(200)
                  .json({ message: "Password Updated successfully" });
              } else {
                res.status(500).json({ error: "can't update password" });
              }
            }
          }
        }
      } else {
        res.status(400).json({ error: "user not found " });
      }
    } else {
      res.status(400).json({ error: "request body required" });
    }
  } catch (err) {
    console.error(err);
  }
};

exports.getChefById = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var kitchenId = req.params.kitchenId;
    // var adminId = req.params.adminId;
    var employeeId = req.params.chefId;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await Employee.get({
    kitchenId: kitchenId,
    role: "chef",
    employeeId: employeeId,
  });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};
exports.getAllChef = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var kitchenId = req.params.kitchenId;
    // var adminId = req.params.adminId;
    // var employeeId = req.params.chefId;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await Employee.get({ kitchenId: kitchenId, role: "chef" });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

exports.getEmployeeCount = async (req, res, next) => {
  try {
    if (req.params != null && req.params != undefined) {
      var kitchenId = req.params.kitchenId;
    } else {
      res.json({ error: "request parameters required" });
    }
    let employeeCount = await Employee.count({ kitchenId: kitchenId });
    if (employeeCount) {
      res.status(200).json({ employeeCount });
    } else {
      res.status(400).json({ error: "data not found" });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.getSchedule = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var kitchenId = req.params.kitchenId;
    // var adminId = req.params.adminId;
    // var employeeId = req.params.chefId;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await Employee.getShifts({ kitchenId: kitchenId });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

exports.getScheduleById = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var kitchenId = req.params.kitchenId;
    var adminId = req.params.adminId;
    var employeeId = req.params.employeeId;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await Employee.getShifts({
    kitchenId: kitchenId,
    adminId: adminId,
    employeeId: employeeId,
  });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

exports.getRoles = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var kitchenId = req.params.kitchenId;
    var adminId = req.params.adminId;
  } else {
    res.json({ error: "request parameters required" });
  }
  let result = await Employee.get({ adminId: adminId, kitchenId: kitchenId });
  let roles = [];
  for (let i = 0; i < result.length; i++) {
    roles[i] = result[i]["role"];
  }
  let rData = roles.flat();
  let unique = rData.filter((item, i, ar) => ar.indexOf(item) === i);
  if (result) {
    res.status(200).json({ roles: unique });
  } else {
    res.status(400).json({ error: "data not found" });
  }
};
