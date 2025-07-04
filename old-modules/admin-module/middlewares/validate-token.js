const jwt = require('jsonwebtoken');
var log = require('../logger');
var admin = require('../doa/subadmin');

validateJWTToken = async (req, res, next) => {
    log.info("Inside validateJWTToken == " + req);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({ error: "Token is required" });
    }
    let passKey = token.split(' ')[1];
    try {
        const decoded = jwt.verify(passKey, process.env.JWT_KEY);
        if (decoded) {
            let user = await admin.getOne({ emailId: decoded.emailId });
            if (user) {
                req.user = user;
                return next();
            } else {
                return res.status(401).send(error);
            }
        } else {
            return res.status(401).send(error);
        }
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
};

isSuperAdmin = (req, res, next) => {
    log.info("Inside validateJWTToken == " + req);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({ error: "Token is required" });
    }
    let passKey = token.split(' ')[1];
    try {
        const decoded = jwt.verify(passKey, process.env.JWT_KEY);
        console.log(decoded);
        if (decoded) {
            if (decoded.role === 'super_admin') {
                return next();
            }
            else {
                return res.status(403).send({
                    message: "Require Super Admin Role!"
                });
            }
        } else {
            return res.status(401).send(error);
        }
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
};

isSubAdmin = (req, res, next) => {
    log.info("Inside validateJWTToken == " + req);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({ error: "Token is required" });
    }
    let passKey = token.split(' ')[1];
    try {
        const decoded = jwt.verify(passKey, process.env.JWT_KEY);
        console.log(decoded);
        if (decoded) {
            if (decoded.role === 'super_admin' || decoded.role === 'sub_admin') {
                return next();
            }
            else {
                return res.status(403).send({
                    message: "Require Super Admin or Sub Admin Role!"
                });
            }
        } else {
            return res.status(401).send(error);
        }
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
};

const authJwt = {
    validateJWTToken: validateJWTToken,
    isSuperAdmin: isSuperAdmin,
    isSubAdmin: isSubAdmin
};

module.exports = authJwt;