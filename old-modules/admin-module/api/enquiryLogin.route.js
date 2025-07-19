var enquiryLogin = require('../controller/enquiryLogin')
const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({});

const querySchemaGetLogin = Joi.object({
    emailId: Joi.string(),
    password: Joi.string()
});

module.exports = async function (router) {
    router.patch('/enquiry-login', enquiryLogin.getEnquiryLogin);
}