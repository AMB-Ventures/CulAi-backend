const express = require('express');
const router = express.Router();

const subscription = require('../controllers/subscription.controller');

router.patch('/subscription', subscription.createSubscription);
router.put('/subscription', subscription.getSubscriptions);
router.get('/subscription/:_id', subscription.getSubscriptionById);
router.put('/subscription/:_id', subscription.updateSubscription);
router.delete('/subscription/:_id', subscription.removeSubscription);
router.patch('/subscription/:_id', subscription.updatePublish);

module.exports = router;
