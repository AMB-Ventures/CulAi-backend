/*
The code below will change act as router for employee service
*/
var inquiry = require('../controller/inquiry');
var auth = require('../middlewares/validate-token')

const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({});

const querySchemaCreateOrGetAllInquiry = Joi.object().keys({
    kitchenName: Joi.string().required(),
    kitchenLogo: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    emailId: Joi.string().required(),
    createdAt: new Date().toISOString,
    updatedAt: new Date().toISOString,
});

const querySchemaUpdateOrDeleteInquiry = Joi.object({
    inquiryId: Joi.number()
});
const querySchemaExport = Joi.object({
    exportType: Joi.string().required()
});

module.exports = async function(router) {
    router.post('/inquiry', [auth.verifyToken, auth.isSuperAdmin], validator.body(querySchemaCreateOrGetAllInquiry), inquiry.createInquiry);
    router.get('/inquiries', [auth.verifyToken, auth.isSuperAdmin], inquiry.getInquiries);
    router.get('/inquiry/:inquiryId', [auth.verifyToken, auth.isSuperAdmin], inquiry.getInquiryByID);
    router.patch('/inquiry/:inquiryId/update-status', [auth.verifyToken, auth.isSuperAdmin], inquiry.updateStatus)
    router.delete('/inquiry/:inquiryId', [auth.verifyToken, auth.isSuperAdmin], validator.params(querySchemaUpdateOrDeleteInquiry), inquiry.removeInquiry);
    router.get('/inquiry/:exportType/export-document', [auth.verifyToken, auth.isSuperAdmin], validator.params(querySchemaExport), inquiry.exportDocument);

}