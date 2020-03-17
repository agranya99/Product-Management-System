const express = require('express');
const joi = require('joi');
const productController = require('../controllers/product.controller');
const joiValidator = require('../middlewares/joiValidator');

const router = express.Router();

const createProductSchema = {
    body: joi.object({
        'sku': joi.string().length(8).required(),
        'name': joi.string().required(),
        'categoryID': joi.number().integer().min(0).required(),
        'qTags': joi.array().items(joi.string()).default([]),
        'attributes': joi.object().pattern(/^/, joi.array().items(joi.string()).default([])),
        'price': joi.number().min(0).required(),
        'imageURLs': joi.array().items(joi.string()).default([]),
        'providerID': joi.number().integer().min(0).default(0),
        'launchDate': joi.date(),
        'stock': joi.number().integer().default(0),
        'status': joi.string().valid(['available', 'pipeline']).default('available')
    })
}


router.post('/', (req, res, next) => joiValidator(createProductSchema, req, res, next), productController.createProduct);
//router.use('/', (req, res, next) => joiValidator(createProductSchema, req, res, next));
module.exports = router;