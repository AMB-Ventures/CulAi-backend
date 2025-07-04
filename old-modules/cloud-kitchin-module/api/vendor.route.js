var vendor = require('../controller/vendor');
const Joi = require('joi');
var auth = require('../middlewares/validate-token');
const validator = require('express-joi-validation').createValidator({});

const querySchemaCreateOrGetAllvendor = Joi.object().keys({
    vendorName: Joi.string().required(),
    vendorLogo: Joi.string().required(),
    licenseKey: Joi.string().required(),
    webHookUrl: Joi.string().required()
});

const querySchemaUpdateOrDeletevendor = Joi.object({
    vendorId: Joi.number()
});
const querySchemaExport = Joi.object({
    exportType: Joi.string().required()
});


module.exports = function(router) {
    // router.post('/vendor', [auth.verifyToken, auth.isSuperAdmin], validator.body(querySchemaCreateOrGetAllvendor), vendor.createVendor);
    // router.get('/vendors', [auth.verifyToken, auth.isSuperAdmin], vendor.getVendors);
    router.get('/vendors', vendor.getVendors);
    // router.delete('/vendor/:vendorId', [auth.verifyToken, auth.isSuperAdmin], validator.params(querySchemaUpdateOrDeletevendor), vendor.removeVendor);
    // router.put('/vendor/:vendorId', [auth.verifyToken, auth.isSuperAdmin], vendor.updateVendor);
    // router.get('/vendor/:exportType/export-document', [auth.verifyToken, auth.isSuperAdmin], validator.params(querySchemaExport), vendor.exportDocument);
    // router.patch('/vendor/:vendorId/publish-status', [auth.verifyToken, auth.isSuperAdmin], vendor.updatePublish)
}