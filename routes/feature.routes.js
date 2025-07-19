const express = require('express');
const router = express.Router();
const feature = require('../controllers/feature.controller');
const auth = require('../middlewares/auth');

router.patch('/feature', [auth.verifyToken, auth.isSuperAdmin], feature.createFeature);
router.get('/features', [auth.verifyToken, auth.isSubAdmin], feature.getFeatures);
router.get('/feature/:_id', [auth.verifyToken, auth.isSuperAdmin], feature.getFeaturesById);
router.delete('/feature/:_id', [auth.verifyToken, auth.isSuperAdmin], feature.removeFeature);
router.put('/feature/:_id', feature.updateFeature);
router.patch('/feature/:_id', [auth.verifyToken, auth.isSuperAdmin], feature.updatePublish);

module.exports = router;
