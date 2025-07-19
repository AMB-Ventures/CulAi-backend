var Admin = require("../doa/subadmin");
var log = require("../logger");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

exports.getLogin = async (req, res, next) => {
  try {
    let verification = await new Promise(async (resolve, reject) => {
      var responseObject = {};
      if (req.body.emailId !== undefined && req.body.emailId !== null) {
        log.info("Inside Login == " + req.body.emailId);
        let emailId = req.body.emailId.toLowerCase();
        let user = await Admin.getOne({ emailId: emailId });
        if (user) {
          if (user.status != "true") {
            if (bcrypt.compareSync(req.body.password, user.password)) {
              const token = jwt.sign(
                {
                  emailId: req.body.emailId,
                  role: user.role,
                },
                process.env.JWT_KEY,
                {
                  // expiresIn: "2h",
                }
              );
              responseObject.code = 200;
              responseObject.body = {
                message: "Authorized",
                token: token,
                userDetails: user,
              };
              resolve(responseObject);
            } else {
              responseObject.code = 401;
              responseObject.body = { message: "Unauthorized" };
              resolve(responseObject);
            }
          } else {
            responseObject.code = 401;
            responseObject.body = { message: "user is blocked" };
            resolve(responseObject);
          }
        } else {
          responseObject.code = 500;
          log.info("Inside Login error == ");
          responseObject.body = {
            message:
              "User with this Email does not exist.Team will get back to you soon !",
          };
          resolve(responseObject);
        }
      } else {
        responseObject.code = 200;
        responseObject.body = { message: "request body required" };
        resolve(responseObject);
      }
    });
    res.status(verification.code).json(verification.body);
  } catch (err) {
    console.error("error ===>", err);
  }
};
