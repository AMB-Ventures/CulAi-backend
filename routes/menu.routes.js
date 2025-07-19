const express = require('express');
const router = express.Router();

const menu = require('../controllers/menu.controller');

router.get('/get-categories-menu/:categoryId/subcategory/:subCategoryId', menu.getMenuByCategory);

module.exports = router;
