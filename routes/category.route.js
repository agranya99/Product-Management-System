const express = require('express');
const router = express.Router();


const categoryController = require('../controllers/category.controller');


router.get('/test', categoryController.test);
module.exports = router;