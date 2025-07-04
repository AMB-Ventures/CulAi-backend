const express = require('express');
const router = express.Router();

const contact = require('../controllers/contact_us.controller');

router.patch('/contact', contact.contactUs);

module.exports = router;
