const Category = require('../models/category.model');

// Utility function to handle response in case of DB Errors
async function catchDBErr(err, res) {
    // 400: Invalid Request Error, Duplicate Key...
    // Backup validation since validation already performed by JOI
    if (err.name === "MongoError" || err.name === "ValidationError")
        return res.status(400).send({
            status: 400,
            message: err.message
        });

    // 500: DB connection issues... 
    return res.status(500).send({
        status: 500,
        message: "Oops! Internal server error."
    });
}

exports.createCategory = async (req, res) => {
    const category = new Category(req.body);

    category.save()
        .then((category) => {
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
        .then((category) => {
            if (category.length) {
                return res.status(200).send(category);
            }
            return res.status(404).send({
                status: 404,
                message: "Category not found with categoryID: " + req.params.categoryID
            });
        })
        .catch((err) => catchDBErr(err, res))
};

exports.filterCategories = async (req, res) => {
    const pageOptions = {
        offset: parseInt(req.query.offset, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 10
    }
    const queryObj = {};

    if (req.query.name && req.query.name !== '') {
        queryObj["name"] = req.query.name;
    }
    Category.find(queryObj)
        .skip(pageOptions.offset)
        .limit(pageOptions.limit)
        .then((category) => {
            if (category.length) {
                return res.status(200).send(category);
            }
            return res.status(404).send({
                status: 404,
                message: "No Such Categories Found."
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
        .then((category) => {
            if (!category) {
                return res.status(404).send({
                    status: 404,
                    message: "Category not found with categoryID: " + req.params.categoryID
                });
            }
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
            return res.status(200).send({
                categoryID: category.categoryID,
                status: 200,
                message: "Category deleted successfully"
            });
        })
        .catch((err) => catchDBErr(err, res))
};
