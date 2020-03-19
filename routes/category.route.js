const express = require('express');
const joi = require('joi');
const joiValidator = require('../middlewares/joiValidator');
const categoryController = require('../controllers/category.controller');

const router = express.Router();

const filterCategoriesSchema = {
    query: joi.object({
        'limit': joi.number().min(1),
        'offset': joi.number().min(0),
        'name': joi.string()
    })
}

const createCategorySchema = {
    body: joi.object({
        'categoryID': joi.number().min(0).required(),
        'name': joi.string().required(),
        'parentCategoryID': joi.number().integer().min(-1).default(-1), // -1 for no parent category
    })
}

const getCategorySchema = {
    params: joi.object({
        'categoryID': joi.number().min(0)
    })
}

const updateCategorySchema = {
    params: joi.object({
        'categoryID': joi.number().min(0)
    }),
    body: joi.object({
        'name': joi.string(),
        'parentCategoryID': joi.number().integer().min(-1), // -1 for no parent category
    })
}

router.get('/', (req, res, next) => joiValidator(filterCategoriesSchema, req, res, next), categoryController.filterCategories);
router.post('/', (req, res, next) => joiValidator(createCategorySchema, req, res, next), categoryController.createCategory);
router.get('/:categoryID', (req, res, next) => joiValidator(getCategorySchema, req, res, next), categoryController.getCategory);
router.put('/:categoryID', (req, res, next) => joiValidator(updateCategorySchema, req, res, next), categoryController.updateCategory);
router.delete('/:categoryID', (req, res, next) => joiValidator(getCategorySchema, req, res, next), categoryController.deleteCategory);

module.exports = router;