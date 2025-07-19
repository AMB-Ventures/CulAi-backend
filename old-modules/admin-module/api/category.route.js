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


module.exports = function(router) {
    router.post('/category', validator.body(querySchemaCreateOrGetAllcategory), category.createCategory);
    router.get('/categories', category.getCategories);
    router.get('/category/:categoryId', category.getCategoryById);
    router.delete('/category/:categoryId', validator.params(querySchemaUpdateOrDeletecategory), category.removeCategory);
    router.put('/category/:categoryId', category.updateCategory);
    router.get('/category/:exportType/export-document', [auth.verifyToken, auth.isSuperAdmin], validator.params(querySchemaExport), category.exportDocument);
    router.patch('/category/:categoryId/publish-status', [auth.verifyToken, auth.isSuperAdmin], category.updatePublish)

}