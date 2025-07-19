var subCategory = require('../controller/sub_category');
const Joi = require('joi');
var auth = require('../middlewares/validate-token')
const validator = require('express-joi-validation').createValidator({});

const querySchemaCreateOrGetAllcategory = Joi.object().keys({
    subCategoryName: Joi.string().required(),
    categoryName: Joi.string().required(),
    description: Joi.string().required()
});

const querySchemaUpdateOrDeletecategory = Joi.object({
    subCategoryId: Joi.string().required(),
});
const querySchemaExport = Joi.object({
    exportType: Joi.string().required()
});


module.exports = function(router) {
    router.post('/sub-category', validator.body(querySchemaCreateOrGetAllcategory), subCategory.createSubCategory);
    router.get('/sub-categories', subCategory.getSubCategories);
    router.get('/sub-category/:subCategoryId', subCategory.getSubCategoryById);
    router.delete('/sub-category/:subCategoryId', validator.params(querySchemaUpdateOrDeletecategory), subCategory.removeSubCategory);
    router.put('/sub-category/:subCategoryId', subCategory.updateSubCategory);
    router.get('/sub-category/:exportType/export-document', [auth.verifyToken, auth.isSuperAdmin], validator.params(querySchemaExport), subCategory.exportDocument);
    router.patch('/sub-category/:subCategoryId/publish-status', [auth.verifyToken, auth.isSuperAdmin], subCategory.updatePublish);

}