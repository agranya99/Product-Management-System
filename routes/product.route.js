const express = require('express');
const joi = require('joi');
const joiValidator = require('../middlewares/joiValidator');
const productController = require('../controllers/product.controller');

const router = express.Router();

const filterProductsSchema = {
    query: joi.object({
        'limit': joi.number().min(1),   //?limit=10
        'offset': joi.number().min(0),  //?offset=0
        'name': joi.string(),   //?name=Mamba
        'qTags': joi.string(),  // ?qTags=peripherals,computers
        'attributes': joi.object().pattern(/^/, joi.string()),  //?attributes[colors]=white,grey&attributes[sizes]=13in
        'provider': joi.string(),   //?provider=Razer
        'status': joi.string().valid(['available', 'pipeline']) //?status=available
    })
}

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

const getProductSchema = {
    params: joi.object({
        'sku': joi.string().length(8)
    })
}

const updateProductSchema = {
    params: joi.object({
        'sku': joi.string().length(8)
    }),
    body: joi.object({
        'name': joi.string(),
        'categoryID': joi.number().integer().min(0),
        'qTags': joi.array().items(joi.string()),
        'attributes': joi.object().pattern(/^/, joi.array().items(joi.string())),
        'price': joi.number().min(0),
        'imageURLs': joi.array().items(joi.string()),
        'providerID': joi.number().integer().min(0),
        'launchDate': joi.date(),
        'stock': joi.number().integer(),
        'status': joi.string().valid(['available', 'pipeline'])
    })
}

router.get('/', (req, res, next) => joiValidator(filterProductsSchema, req, res, next), productController.filterProducts);
router.post('/', (req, res, next) => joiValidator(createProductSchema, req, res, next), productController.createProduct);
router.get('/:sku', (req, res, next) => joiValidator(getProductSchema, req, res, next), productController.getProduct);
router.put('/:sku', (req, res, next) => joiValidator(updateProductSchema, req, res, next), productController.updateProduct);
router.delete('/:sku', (req, res, next) => joiValidator(getProductSchema, req, res, next), productController.deleteProduct);
router.get('/:sku/similar', (req, res, next) => joiValidator(getProductSchema, req, res, next), productController.getSimilarProducts);

module.exports = router;