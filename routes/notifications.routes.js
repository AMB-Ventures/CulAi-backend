const express = require('express');
const router = express.Router();

const notifications = require('../controllers/notifications.controller');

router.get('/get-all-notifications/:userId', notifications.getAllNotifications);

module.exports = router;
