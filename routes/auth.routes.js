const express = require("express");
var router = express.Router();

var authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const querySchemaGetLogin = Joi.object({
  username: Joi.string(),
  password: Joi.string(),
});

router.post(
  "/console/login",
  validator.body(querySchemaGetLogin),
  authController.consoleLogin
);

router.post(
  "/pos/login",
  validator.body(querySchemaGetLogin),
  authController.posLogin
);

// Route to get all registered users (requires authentication)
router.get("/users", auth.verifyToken, authController.getAllUsers);

// Route to get all registered users (for testing - no authentication required)
router.get("/users/public", authController.getAllUsers);

module.exports = router;
