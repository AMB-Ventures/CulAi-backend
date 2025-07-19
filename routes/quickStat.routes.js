const express = require('express');
const router = express.Router();

const quickStat = require('../controllers/quickStat.controller');
const auth = require('../middlewares/auth');

router.get('/totalOrders/:kitchenId', quickStat.getOrders);
router.get('/orders/:kitchenId', [auth.verifyToken, auth.isSuperAdmin], quickStat.getTotalOrders);

module.exports = router;
