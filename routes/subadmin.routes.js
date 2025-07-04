const express = require('express');
const router = express.Router();

const subadmin = require('../controllers/subadmin.controller');
const Joi = require('joi');
const auth = require('../middlewares/auth');
const validator = require('express-joi-validation').createValidator({});

const querySchemaCreateOrGetAllsubadmin = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailId: Joi.string().required(),
    cloudKitchens: Joi.array(),
    accessControl: {
        enquiry: {
            add: Joi.boolean().required(),
            edit: Joi.boolean().required(),
            delete: Joi.boolean().required(),
            view: Joi.boolean().required(),
        },
        cloudKitchens: {
            add: Joi.boolean().required(),
            edit: Joi.boolean().required(),
            delete: Joi.boolean().required(),
            view: Joi.boolean().required(),
        },
        vendor: {
            add: Joi.boolean().required(),
            edit: Joi.boolean().required(),
            delete: Joi.boolean().required(),
            view: Joi.boolean().required(),
        },
        category: {
            add: Joi.boolean().required(),
            edit: Joi.boolean().required(),
            delete: Joi.boolean().required(),
            view: Joi.boolean().required(),
        },
        subcategory: {
            add: Joi.boolean().required(),
            edit: Joi.boolean().required(),
            delete: Joi.boolean().required(),
            view: Joi.boolean().required(),
        },
        settings: {
            add: Joi.boolean().required(),
            edit: Joi.boolean().required(),
            delete: Joi.boolean().required(),
            view: Joi.boolean().required(),
        }
    }
});

const querySchemaUpdateOrDeletesubadmin = Joi.object({
    userId: Joi.number().required(),
});

const querySchemaUpdatePassword = Joi.object({
    // currentPassword: Joi.string(),
    newPassword: Joi.string(),
    confirmPassword: Joi.string()
});
const querySchemaExport = Joi.object({
    exportType: Joi.string().required()
});

router.post('/subadmin', [auth.verifyToken, auth.isSuperAdmin], validator.body(querySchemaCreateOrGetAllsubadmin), subadmin.createSubAdmin);
router.get('/subadmins', [auth.verifyToken, auth.isSuperAdmin], subadmin.getSubAdmins);
router.get('/subadmin/:userId', [auth.verifyToken, auth.isSubAdmin], subadmin.getSubAdminbyId);
router.delete('/subadmin/:userId', [auth.verifyToken, auth.isSuperAdmin], validator.params(querySchemaUpdateOrDeletesubadmin), subadmin.removeSubAdmin);
router.put('/subadmin/:userId', [auth.verifyToken, auth.isSuperAdmin], subadmin.updateSubAdmin);
router.patch('/subadmin/:userId/update-status', [auth.verifyToken, auth.isSuperAdmin], subadmin.updateStatus);
router.patch('/subadmin/:userId/update-password', validator.body(querySchemaUpdatePassword), subadmin.updatePassword);
router.patch('/subadmin/update-accesscontrol', subadmin.updateSubadminAccessControl);
router.get('/subadmin/:exportType/export-document', [auth.verifyToken, auth.isSuperAdmin], validator.params(querySchemaExport), subadmin.exportDocument);
router.post('/subadmin/forget-password', subadmin.forgetPassword);
router.patch('/subadmin/:userId/reset-password', subadmin.resetPassword);

module.exports = router;
