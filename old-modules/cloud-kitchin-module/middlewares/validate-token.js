const jwt = require('jsonwebtoken');
var log = require('../logger');
var user = require('../doa/user');

validateJWTToken = async (req, res, next) => {
    log.info("Inside validateJWTToken == " + req);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send("UnAuthorized");
    }
    let passKey = token.split(' ')[1];
    try {
        const decoded = jwt.verify(passKey, process.env.JWT_KEY);
        if (decoded) {
            let userData = await user.getOne({ emailId: decoded.emailId });
            if (userData) {
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

isKitchenAdmin = (req, res, next) => {
    log.info("Inside validateJWTToken == " + req);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send("UnAuthorized");
    }
    let passKey = token.split(' ')[1];
    try {
        const decoded = jwt.verify(passKey, process.env.JWT_KEY);
        console.log(decoded);
        if (decoded) {
            if (decoded.role === 'kitchen_admin') {
                return next();
            } else {
                return res.status(403).send({
                    message: "Require Kitchen Admin Role!"
                });
            }
        } else {
            return res.status(401).send(error);
        }
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
};
isChef = (req, res, next) => {
    log.info("Inside validateJWTToken == " + req);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send("UnAuthorized");
    }
    let passKey = token.split(' ')[1];
    try {
        const decoded = jwt.verify(passKey, process.env.JWT_KEY);
        console.log(decoded.role);
        if (decoded) {
            if (decoded.role === 'chef') {
                return next();
            } else {
                return res.status(403).send({
                    message: "Require chef Role!"
                });
            }
        } else {
            return res.status(401).send(error);
        }
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
};
isReceptionist = (req, res, next) => {
    log.info("Inside validateJWTToken == " + req);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send("UnAuthorized");
    }
    let passKey = token.split(' ')[1];
    try {
        const decoded = jwt.verify(passKey, process.env.JWT_KEY);
        console.log(decoded);
        if (decoded) {
            if (decoded.role === 'receptionist') {
                return next();
            } else {
                return res.status(403).send({
                    message: "Require receptionist Role!"
                });
            }
        } else {
            return res.status(401).send(error);
        }
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
};
isQA = (req, res, next) => {
    log.info("Inside validateJWTToken == " + req);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send("UnAuthorized");
    }
    let passKey = token.split(' ')[1];
    try {
        const decoded = jwt.verify(passKey, process.env.JWT_KEY);
        console.log(decoded);
        if (decoded) {
            if (decoded.role === 'qa') {
                return next();
            } else {
                return res.status(403).send({
                    message: "Require qa Role!"
                });
            }
        } else {
            return res.status(401).send(error);
        }
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
};

isAdminReceptionist = (req, res, next) => {
    log.info("Inside validateJWTToken == " + req);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send("UnAuthorized");
    }
    let passKey = token.split(' ')[1];
    try {
        const decoded = jwt.verify(passKey, process.env.JWT_KEY);
        // console.log(decoded);
        if (decoded) {
            if (decoded.role === 'receptionist' || decoded.role === 'kitchen_admin') {
                return next();
            } else {
                return res.status(403).send({
                    message: "Require receptionist or kitchen_admin Role!"
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
    isKitchenAdmin: isKitchenAdmin,
    isChef: isChef,
    isReceptionist: isReceptionist,
    isQA: isQA,
    isAdminReceptionist: isAdminReceptionist
};

module.exports = authJwt;