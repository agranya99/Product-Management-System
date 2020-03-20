const Category = require('../models/category.model');
const Product = require('../models/product.model');

// Utility function to handle response in case of DB Errors
async function catchDBErr(err, res) {
    // 400: Invalid Request Error, Duplicate Key...
    // Backup validation since validation already performed by JOI
    if (err.name === "MongoError" || err.name === "ValidationError")
        return res.status(400).send({
            status: 400,
            message: err.message
        });
    else {
        // 500: DB connection issues... 
        return res.status(500).send({
            status: 500,
            message: "Oops! Internal server error."
        });
    }
}

// facilitate searching of categories
exports.filterCategories = async (req, res) => {
    const pageOptions = {
        offset: parseInt(req.query.offset, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 10
    }
    const queryObj = {};
    // search by name
    if (req.query.name && req.query.name !== '') {
        queryObj["name"] = req.query.name;
    }
    Category.find(queryObj)
        .skip(pageOptions.offset)
        .limit(pageOptions.limit)
        .select(['-_id', '-__v'])
        .then((category) => {
            if (category.length) {
                // All OK
                return res.status(200).send(category);
            }
            return res.status(404).send({
                status: 404,
                message: "No Such Categories Found."
            });
        })
        .catch((err) => catchDBErr(err, res))
};

exports.createCategory = async (req, res) => {
    const category = new Category(req.body);

    category.save()
        .then((category) => {
            // All OK
            return res.status(200).send({
                categoryID: category.categoryID,
                status: 200,
                message: "Category Created Successfully"
            });
        })
        .catch((err) => catchDBErr(err, res))
};

exports.getCategory = async (req, res) => {
    Category.find({ categoryID: req.params.categoryID })
        .select(['-_id', '-__v'])
        .then((category) => {
            if (category.length) {
                // All OK
                return res.status(200).send(category);
            }
            return res.status(404).send({
                status: 404,
                message: "Category not found with categoryID: " + req.params.categoryID
            });
        })
        .catch((err) => catchDBErr(err, res))
};

exports.updateCategory = async (req, res) => {
    // Validate Request
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            status: 400,
            message: "Request Body cannot be empty"
        });
    }
    // Find and update category with the request body
    Category.findOneAndUpdate({ categoryID: req.params.categoryID }, req.body, { new: true })
        .select(['-_id', '-__v'])
        .then((category) => {
            if (!category) {
                return res.status(404).send({
                    status: 404,
                    message: "Category not found with categoryID: " + req.params.categoryID
                });
            }
            // All OK
            return res.send(category);
        })
        .catch((err) => catchDBErr(err, res))
};

exports.deleteCategory = async (req, res) => {
    Category.findOneAndRemove({ categoryID: req.params.categoryID })
        .then((category) => {
            if (!category) {
                return res.status(404).send({
                    status: 404,
                    message: "Category not found with categoryID: " + req.params.categoryID
                });
            }
            // All OK
            return res.status(200).send({
                categoryID: category.categoryID,
                status: 200,
                message: "Category deleted successfully"
            });
        })
        .catch((err) => catchDBErr(err, res))
};

exports.getSubCategories = async (req, res) => {
    Category.find({ categoryID: req.params.categoryID })
        .then((category) => {
            if (category.length) {
                // find categories with parentCategoryID == this.categoryID
                Category.find({ parentCategoryID: category[0].categoryID })
                    .select(['-_id', '-__v'])
                    .then((category) => {
                        if (category.length) {
                            // All OK
                            res.status(200).send(category);
                        }
                        else {
                            return res.status(404).send({
                                status: 404,
                                message: "No Sub-Categories for categoryID: " + req.params.categoryID
                            });
                        }
                    })
                    .catch((err) => catchDBErr(err, res))
            }
            else {
                return res.status(404).send({
                    status: 404,
                    message: "Category not found with categoryID: " + req.params.categoryID
                });
            }
        })
        .catch((err) => catchDBErr(err, res))
};

exports.getCategoryProducts = async (req, res) => {
    Category.find({ categoryID: req.params.categoryID })
        .then((category) => {
            if (category.length) {
                // find products with categoryID == this.categoryID
                Product.find({ categoryID: category[0].categoryID })
                    .select(['-_id', '-__v'])
                    .then((product) => {
                        if (product.length) {
                            // All OK
                            res.status(200).send(product);
                        }
                        else {
                            return res.status(404).send({
                                status: 404,
                                message: "No Products for categoryID: " + req.params.categoryID
                            });
                        }
                    })
                    .catch((err) => catchDBErr(err, res))
            }
            else {
                return res.status(404).send({
                    status: 404,
                    message: "Category not found with categoryID: " + req.params.categoryID
                });
            }
        })
        .catch((err) => catchDBErr(err, res))
}