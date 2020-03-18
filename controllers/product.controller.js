const Product = require('../models/product.model');


exports.getProducts = async (req, res) => {
    console.log(req.query);
    return res.send("OK");
};

exports.createProduct = async (req, res) => {
    const product = new Product(req.body);

    product.save()
        .then((product) => {
            return res.status(200).send({
                sku: product.sku,
                status: 200,
                message: "Product Created Successfully"
            });
        })
        .catch((err) => {
            if(err.name === "MongoError" || err.name === "ValidationError")
                return res.status(400).send({
                    status: 400,
                    message: err.message
                });
            // 500: DB connection issues etc... 
            return res.status(500).send({
                status: 500,
                message: "Oops! Internal server error."
            });
        })
};

exports.getProduct = async (req, res) => {
    Product.find({ sku: req.params.sku })
        .then((product) => {
            if (product.length) {
                return res.status(200).send(product);  
            }
            return res.status(404).send({
                status: 404,
                message: "Product not found with sku: " + req.params.sku
            });
        })
        .catch((err) => {
            if (err.name === "MongoError" || err.name === "ValidationError")
                return res.status(400).send({
                    status: 400,
                    message: err.message
                });
            // 500: DB connection issues etc... 
            return res.status(500).send({
                status: 500,
                message: "Oops! Internal server error."
            });
        })
};

exports.updateProduct = async (req, res) => {
    // Validate Request
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            status: 400,
            message: "Request Body cannot be empty"
        });
    }
    // Find and update product with the request body
    Product.findOneAndUpdate({ sku: req.params.sku }, req.body, { new: true })
        .then((product) => {
            if (!product) {
                return res.status(404).send({
                    status: 404,
                    message: "Product not found with sku: " + req.params.sku
                });
            }
            return res.send(product);
        })
        .catch((err) => {
            /*if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.productId
                });
            } */
            if (err.name === "MongoError" || err.name === "ValidationError")
                return res.status(400).send({
                    status: 400,
                    message: err.message
                });
            // 500: DB connection issues etc... 
            return res.status(500).send({
                status: 500,
                message: "Oops! Internal server error."
            });
        })
};

exports.deleteProduct = async (req, res) => {
    Product.findOneAndRemove({ sku: req.params.sku })
        .then((product) => {
            if (!product) {
                return res.status(404).send({
                    status: 404,
                    message: "Product not found with sku: " + req.params.sku
                });
            }
            return res.status(200).send({
                sku: product.sku,
                status: 200,
                message: "Product deleted successfully"
            });
        })
        .catch((err) => {
            if (err.name === "MongoError" || err.name === "ValidationError")
                return res.status(400).send({
                    status: 400,
                    message: err.message
                });
            // 500: DB connection issues etc... 
            return res.status(500).send({
                status: 500,
                message: "Oops! Internal server error."
            });
        })
};
