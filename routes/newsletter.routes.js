const express = require('express');
const router = express.Router();

const newsletter = require('../controllers/newsletter.controller');
const auth = require('../middlewares/auth');

router.patch('/newsletter', newsletter.createNewsletter);
router.get('/newsletters', newsletter.getAllNewsletters);
router.get('/newsletter/:_id', newsletter.getNewsletterById);
router.delete('/newsletter/:_id', newsletter.removeNewsletter);
router.put('/newsletter/:_id', newsletter.updateNewsletter);

module.exports = router;
