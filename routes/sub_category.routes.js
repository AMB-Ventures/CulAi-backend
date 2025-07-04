const express = require('express');
const router = express.Router();

const subCategory = require('../controllers/sub_category.controller');
const Joi = require('joi');
const auth = require('../middlewares/auth');
const validator = require('express-joi-validation').createValidator({});

const querySchemaCreateOrGetAllcategory = Joi.object().keys({
    subCategoryName: Joi.string().required(),
    categoryName: Joi.string().required(),
    description: Joi.string().required(),
    categoriesId: Joi.string().required(),
});

const querySchemaUpdateOrDeletecategory = Joi.object({
    subCategoryId: Joi.string().required(),
});
const querySchemaExport = Joi.object({
    exportType: Joi.string().required()
});

router.post('/sub-category', validator.body(querySchemaCreateOrGetAllcategory), subCategory.createSubCategory);
router.get('/sub-categories', subCategory.getSubCategories);

module.exports = router;
