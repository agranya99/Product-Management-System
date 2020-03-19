const express = require('express');
const joi = require('joi');
const joiValidator = require('../middlewares/joiValidator');
const providerController = require('../controllers/provider.controller');

const router = express.Router();

const filterProvidersSchema = {
    query: joi.object({
        'limit': joi.number().min(1),   //?limit=10
        'offset': joi.number().min(0),  //?offset=1
        'name': joi.string(),   //?name=Razer
        'email': joi.string().email()  
    })
}

const createProviderSchema = {
    body: joi.object({
        'providerID': joi.number().min(0).required(),
        'name': joi.string().required(),
        'website': joi.string().uri(),
        'email': joi.string().email()
    })
}

const getProviderSchema = {
    params: joi.object({
        'providerID': joi.number().min(0)
    })
}

const updateProviderSchema = {
    params: joi.object({
        'providerID': joi.number().min(0)
    }),
    body: joi.object({
        'name': joi.string(),
        'website': joi.string().uri(),
        'email': joi.string().email()
    })
}

router.get('/', (req, res, next) => joiValidator(filterProvidersSchema, req, res, next), providerController.filterProviders);
router.post('/', (req, res, next) => joiValidator(createProviderSchema, req, res, next), providerController.createProvider);
router.get('/:providerID', (req, res, next) => joiValidator(getProviderSchema, req, res, next), providerController.getProvider);
router.put('/:providerID', (req, res, next) => joiValidator(updateProviderSchema, req, res, next), providerController.updateProvider);
router.delete('/:providerID', (req, res, next) => joiValidator(getProviderSchema, req, res, next), providerController.deleteProvider);

module.exports = router;