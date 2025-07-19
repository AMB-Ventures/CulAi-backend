var User = require("../doa/user");
var employee = require("../doa/employee");
var log = require("../logger");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

exports.getLogin = async (req, res, next) => {
  log.info("Inside Login == " + req.body.userId);
  var responseObject = {};
  let verification = await new Promise(async (resolve, reject) => {
    var emailId = req.body.emailId;
    const role = req.body.role;
    if (emailId.includes("@")) {
      var emailId = req.body.emailId.toLowerCase();
      let user = await User.getOne({ emailId: emailId });
      if (user) {
        if (bcrypt.compareSync(req.body.password, user?.password)) {
          if (user.role.includes(role)) {
            const token = jwt.sign(
              {
                emailId: emailId,
                role: role,
              },
              process.env.JWT_KEY,
              {
                // expiresIn: "2h",
              }
            );
            let data = await employee.getOne({ emailId: emailId });
            responseObject.code = 200;
            console.log(data, emailId, role);
            const accessRole = {};
            data?.roleAccessControl?.accessControl?.forEach((p) => {
              accessRole[p.title] = {
                view: p.view || role === "kitchen_admin" ? true : false,
                add: p.add || role === "kitchen_admin" ? true : false,
                edit: p.edit || role === "kitchen_admin" ? true : false,
                delete: p.delete || role === "kitchen_admin" ? true : false,
              };
            });
            responseObject.body = {
              message: "Authorized",
              token: token,
              userDetails: user,
              accessRole: accessRole,
              details: data,
            };
            resolve(responseObject);
          } else {
            responseObject.code = 401;
            responseObject.body = {
              message: "User does not have requested role",
            };
            resolve(responseObject);
          }
        } else {
          responseObject.code = 401;
          responseObject.body = { message: "Unauthorized" };
          resolve(responseObject);
        }
      } else {
        res.json({
          error: "Employee does not exist.Team will get back to you soon !",
        });
      }
    } else {
      let user = await employee.getOne({ mobileNumber: req.body.emailId });
      if (user) {
        if (user.role.includes(role) && (role == "chef" || role == "qa")) {
          let result = await User.getOne({ emailId: user.emailId });
          if (bcrypt.compareSync(req.body.password, result.password)) {
            const token = jwt.sign(
              {
                emailId: user.emailId,
                role: role,
              },
              process.env.JWT_KEY,
              {
                // expiresIn: "2h",
              }
            );
            let data = await employee.getOne({
              mobileNumber: req.body.emailId,
            });
            responseObject.code = 200;
            responseObject.body = {
              message: "Authorized",
              token: token,
              userDetails: result,
              accessControl: data.accessControl,
              details: data,
            };
            resolve(responseObject);
          } else {
            responseObject.code = 401;
            responseObject.body = { message: "Unauthorized" };
            resolve(responseObject);
          }
        } else {
          responseObject.code = 401;
          responseObject.body = {
            message: "Mobile login is only allowed to chef and qa",
          };
          resolve(responseObject);
        }
      } else {
        res.json({
          error: "Employee does not exist.Team will get back to you soon !",
        });
      }
    }
  });
  res.status(verification.code).json(verification.body);
};

// exports.getLogin = async (req, res, next) => {
//     log.info("Inside Login == " + req.body.userId);
//     var responseObject = {}
//     let verification = await new Promise(async (resolve, reject) => {
//         let user = await User.getOne({ emailId: req.body.emailId });
//         if (user) {
//             if (bcrypt.compareSync(req.body.password, user.password)) {
//                 const token = jwt.sign({
//                     emailId: req.body.emailId,
//                     role: user.role
//                 }, process.env.JWT_KEY, {
//                     // expiresIn: "2h",
//                 })
//                 if (user.role == "chef" || user.role == "qa" || user.role == "receptionist") {
//                     let data = await employee.getOne({ emailId: req.body.emailId });
//                     responseObject.code = 200;
//                     responseObject.body = { 'message': 'Authorized', 'token': token, 'userDetails': user, 'accessControl': data.accessControl, 'details': data }
//                     resolve(responseObject);
//                 } else {
//                     responseObject.code = 200;
//                     responseObject.body = { 'message': 'Authorized', 'token': token, 'userDetails': user }
//                     resolve(responseObject);
//                 }

//             } else {
//                 responseObject.code = 401;
//                 responseObject.body = { 'message': 'Unauthorized' }
//                 resolve(responseObject);
//             }
//         } else {
//             res.json({ error: "Enquiry with this Email does not exist.Team will get back to you soon !" });
//             // responseObject.code = 500;
//             // responseObject.body = 'Unable to Connect Database'
//             // reject(responseObject);
//         }
//     })
//     res.status(verification.code).json(verification.body);
// }

// exports.getEmployeeLogin = async (req, res, next) => {
//     log.info("Inside Login == " + req.body.emailId);
//     var responseObject = {}
//     let verification = await new Promise(async (resolve, reject) => {
//         let user = await employee.getOne({ emailId: req.body.emailId });
//         if (user) {
//             if (bcrypt.compareSync(req.body.password, user.password)) {
//                 const token = jwt.sign({
//                     emailId: req.body.emailId,
//                     role: user.role
//                 }, process.env.JWT_KEY, {
//                     expiresIn: "2h",
//                 })
//                 responseObject.code = 200;
//                 responseObject.body = { 'message': 'Authorized', 'token': token, 'userDetails': user }
//                 resolve(responseObject);

//             } else {
//                 responseObject.code = 401;
//                 responseObject.body = { 'message': 'Unauthorized' }
//                 resolve(responseObject);
//             }
//         }
//         else {
//             res.json({ error: "Enquiry with this Email does not exist.Team will get back to you soon !" });
//             // responseObject.code = 500;
//             // responseObject.body = 'Unable to Connect Database'
//             // reject(responseObject);
//         }
//     })
//     res.status(verification.code).json(verification.body);
// }
