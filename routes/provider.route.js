const express = require('express');
const router = express.Router();


const providerController = require('../controllers/provider.controller');


router.get('/test', providerController.test);
module.exports = router;