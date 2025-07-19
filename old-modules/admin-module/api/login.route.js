/*
The code below will change act as router for employee service
*/
var Login = require('../controller/login')
const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({});

const querySchemaGetLogin = Joi.object({
    emailId: Joi.string(),
    password: Joi.string()
});

module.exports = async function (router) {
     router.post('/login', validator.body(querySchemaGetLogin), Login.getLogin);
}