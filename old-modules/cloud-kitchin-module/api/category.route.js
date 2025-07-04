var category = require('../controller/category');
const Joi = require('joi');
var auth = require('../middlewares/validate-token')
const validator = require('express-joi-validation').createValidator({});

const querySchemaCreateOrGetAllcategory = Joi.object().keys({
    categoryName: Joi.string().required(),
    description: Joi.string().required()
});

const querySchemaUpdateOrDeletecategory = Joi.object({
    categoryId: Joi.string().required(),
});
const querySchemaExport = Joi.object({
    exportType: Joi.string().required()
});


module.exports = function (router) {
    router.post('/category', [auth.verifyToken, auth.isKitchenAdmin], validator.body(querySchemaCreateOrGetAllcategory), category.createCategory);
    // Remove validation due to create order functionality in cloud kitchen  [auth.verifyToken, auth.isKitchenAdmin]
    router.get('/categories', category.getCategories);
    router.get('/category/:categoryId', [auth.verifyToken, auth.isKitchenAdmin], category.getCategoryById);
    router.delete('/category/:categoryId', [auth.verifyToken, auth.isKitchenAdmin], validator.params(querySchemaUpdateOrDeletecategory), category.removeCategory);
    router.put('/category/:categoryId', [auth.verifyToken, auth.isKitchenAdmin], category.updateCategory);
    router.patch('/category/:categoryId/publish-status', [auth.verifyToken, auth.isKitchenAdmin], category.updatePublish)
    router.get('/category/:exportType/export-document', [auth.verifyToken, auth.isKitchenAdmin], validator.params(querySchemaExport), category.exportDocument);
}