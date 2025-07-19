const express = require("express");
const router = express.Router();

const role = require("../controllers/role.controller");

router.get("/roles", role.getRoles);

module.exports = router;
