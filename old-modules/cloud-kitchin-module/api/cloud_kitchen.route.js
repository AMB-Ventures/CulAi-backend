var cloudKitchen = require('../controller/cloud_kitchen');
var auth = require('../middlewares/validate-token')
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const querySchemaCreateOrGetAllcloudkitchen = Joi.object().keys({
    kitchenName: Joi.string().required(),
    kitchenLogo: Joi.string().required(),
    kitchenDetails: Joi.string().required(),
    kitchenDemographicDetails: Joi.string().required(),
    kitchenEmail: Joi.string().required(),
    merchantConfig: Joi.array().items({
        vendorId: Joi.number().required(),
        merchantId: Joi.string().required(),
        merchantName: Joi.string().required(),
        merchantLogo: Joi.string().required()
    })
});

const querySchemaUpdateOrDeletecloudkitchen = Joi.object({
    kitchenId: Joi.number().required(),
    // userId: Joi.number().required()
});
const querySchemaExport = Joi.object({
    exportType: Joi.string().required()
});

module.exports = function (router) {
    // router.post('/cloudkitchen', validator.body(querySchemaCreateOrGetAllcloudkitchen), cloudKitchen.createCloudkitchen);
    // router.get('/cloudkitchens', cloudKitchen.getCloudkitchens);
    router.get('/cloudkitchen/:kitchenId', cloudKitchen.getCloudkitchenById);
    // router.delete('/cloudkitchen/:kitchenId', validator.params(querySchemaUpdateOrDeletecloudkitchen), cloudKitchen.removeCloudkitchen);
    // router.put('/cloudkitchen/:kitchenId', cloudKitchen.updateCloudkitchen);
    // router.get('/cloudkitchen/:exportType/export-document', validator.params(querySchemaExport), cloudKitchen.exportDocument);
    // router.patch('/cloudkitchen/:kitchenId/Publish-status', cloudKitchen.updatePublish);
    router.get('/:kitchenId/merchants', [auth.verifyToken, auth.isKitchenAdmin], cloudKitchen.getallmerchants);
    router.patch('/:kitchenId', [auth.verifyToken, auth.isKitchenAdmin], cloudKitchen.autoAssign);
    router.patch('/:kitchenId/busy', [auth.verifyToken, auth.isKitchenAdmin], cloudKitchen.busy);
    // router.get('/:kitchenId/merchantId/:merchantId', [auth.verifyToken, auth.isKitchenAdmin], cloudKitchen.getCloudkitchenBymerchantId);

    router.patch('/schedule/:kitchenId', [auth.verifyToken, auth.isKitchenAdmin], cloudKitchen.schedule);
    router.get('/schedule/:kitchenId', [auth.verifyToken, auth.isKitchenAdmin], cloudKitchen.getSchedule);
}