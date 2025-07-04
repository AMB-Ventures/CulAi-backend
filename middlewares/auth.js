const jwt = require("jsonwebtoken");
var log = require("../logger");
// var user = require("../doa/user.doa");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ error: "Token is required" });
  }
  let JWTToken = token.split(" ")[1];
  try {
    const decoded = jwt.verify(JWTToken, process.env.JWT_KEY);
    if (decoded) {
      req.user = decoded;
      return next();
    } else {
      return res.status(401).send(error);
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

const isSuperAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ error: "Token is required" });
  }
  let passKey = token.split(" ")[1];
  try {
    const decoded = jwt.verify(passKey, process.env.JWT_KEY);
    console.log(decoded);
    if (decoded) {
      if (decoded.role === "super_admin") {
        return next();
      } else {
        return res.status(403).send({
          message: "Require Super Admin Role!",
        });
      }
    } else {
      return res.status(401).send(error);
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

const isSubAdmin = (req, res, next) => {
  log.info("Inside validateJWTToken == " + req);
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ error: "Token is required" });
  }
  let passKey = token.split(" ")[1];
  try {
    const decoded = jwt.verify(passKey, process.env.JWT_KEY);
    console.log(decoded);
    if (decoded) {
      if (decoded.role === "super_admin" || decoded.role === "sub_admin") {
        return next();
      } else {
        return res.status(403).send({
          message: "Require Super Admin or Sub Admin Role!",
        });
      }
    } else {
      return res.status(401).send(error);
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

const isKitchenAdmin = (req, res, next) => {
  log.info("Inside validateJWTToken == " + req);
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("UnAuthorized");
  }
  let passKey = token.split(" ")[1];
  try {
    const decoded = jwt.verify(passKey, process.env.JWT_KEY);
    console.log(decoded);
    if (decoded) {
      if (decoded.role === "kitchen_admin") {
        return next();
      } else {
        return res.status(403).send({
          message: "Require Kitchen Admin Role!",
        });
      }
    } else {
      return res.status(401).send(error);
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

const isChef = (req, res, next) => {
  log.info("Inside validateJWTToken == " + req);
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("UnAuthorized");
  }
  let passKey = token.split(" ")[1];
  try {
    const decoded = jwt.verify(passKey, process.env.JWT_KEY);
    console.log(decoded.role);
    if (decoded) {
      if (decoded.role === "chef") {
        return next();
      } else {
        return res.status(403).send({
          message: "Require chef Role!",
        });
      }
    } else {
      return res.status(401).send(error);
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

const isReceptionist = (req, res, next) => {
  log.info("Inside validateJWTToken == " + req);
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("UnAuthorized");
  }
  let passKey = token.split(" ")[1];
  try {
    const decoded = jwt.verify(passKey, process.env.JWT_KEY);
    console.log(decoded);
    if (decoded) {
      if (decoded.role === "receptionist") {
        return next();
      } else {
        return res.status(403).send({
          message: "Require receptionist Role!",
        });
      }
    } else {
      return res.status(401).send(error);
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

const isQA = (req, res, next) => {
  log.info("Inside validateJWTToken == " + req);
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("UnAuthorized");
  }
  let passKey = token.split(" ")[1];
  try {
    const decoded = jwt.verify(passKey, process.env.JWT_KEY);
    console.log(decoded);
    if (decoded) {
      if (decoded.role === "qa") {
        return next();
      } else {
        return res.status(403).send({
          message: "Require qa Role!",
        });
      }
    } else {
      return res.status(401).send(error);
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

const isAdminReceptionist = (req, res, next) => {
  log.info("Inside validateJWTToken == " + req);
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("UnAuthorized");
  }
  let passKey = token.split(" ")[1];
  try {
    const decoded = jwt.verify(passKey, process.env.JWT_KEY);
    // console.log(decoded);
    if (decoded) {
      if (decoded.role === "receptionist" || decoded.role === "kitchen_admin") {
        return next();
      } else {
        return res.status(403).send({
          message: "Require receptionist or kitchen_admin Role!",
        });
      }
    } else {
      return res.status(401).send(error);
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

const isCashier = (req, res, next) => {
  log.info("Inside validateJWTToken == " + req);
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("UnAuthorized");
  }
  let passKey = token.split(" ")[1];
  try {
    const decoded = jwt.verify(passKey, process.env.JWT_KEY);
    // console.log(decoded);
    if (decoded) {
      if (decoded.role === "cashier" || decoded.role === "chef_head") {
        return next();
      } else {
        return res.status(403).send({
          message: "Require cashier or chef_head Role!",
        });
      }
    } else {
      return res.status(401).send(error);
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = {
  verifyToken,
  isSuperAdmin,
  isSubAdmin,
  isKitchenAdmin,
  isChef,
  isReceptionist,
  isQA,
  isCashier,
  isAdminReceptionist,
};
