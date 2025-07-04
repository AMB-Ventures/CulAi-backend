const express = require('express');
const router = express.Router();
var enquiryLogin = require('../controllers/enquiryLogin.controller');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const querySchemaGetLogin = Joi.object({
    emailId: Joi.string(),
    password: Joi.string()
});

router.patch('/enquiry-login', enquiryLogin.getEnquiryLogin);

module.exports = router;
