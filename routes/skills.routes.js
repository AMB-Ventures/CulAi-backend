const express = require('express');
const router = express.Router();

const skill = require('../controllers/skills.controller');
const auth = require('../middlewares/auth');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const querySchemaCreateOrGetAllskill = Joi.object().keys({
    skills: Joi.string().required(),
    tag: Joi.string().required(),
    updatedBy: Joi.string()
});

const querySchemaGetskill = Joi.object({
    skillId: Joi.number().required()
});
const querySchemaExport = Joi.object({
    exportType: Joi.string().required()
});

router.post('/tag/skills', [auth.verifyToken, auth.isSuperAdmin], validator.body(querySchemaCreateOrGetAllskill), skill.createSkill);
router.get('/tag/skills', [auth.verifyToken, auth.isSuperAdmin], skill.getskill);
router.get('/tag/skills/:skillId', [auth.verifyToken, auth.isSuperAdmin], validator.params(querySchemaGetskill), skill.getSkillsById);
router.delete('/tag/skills/:skillId', [auth.verifyToken, auth.isSuperAdmin], validator.params(querySchemaGetskill), skill.removeSkills);
router.patch('/tag/skills/:skillId', [auth.verifyToken, auth.isSuperAdmin], skill.updateSkill);
router.get('/tag/skills/:exportType/export-document', [auth.verifyToken, auth.isSuperAdmin], validator.params(querySchemaExport), skill.exportDocument);

module.exports = router;
