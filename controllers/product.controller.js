const Product = require('../models/product.model');
const Provider = require('../models/provider.model');


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

exports.filterProducts = async (req, res) => {
    const pageOptions = {
        offset: parseInt(req.query.offset, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 10
    }
    const queryObj = {};

    if (req.query.name && req.query.name !== '') {
        queryObj["name"] = req.query.name;
    }
    if (req.query.status && req.query.status !== '') {
        queryObj["status"] = req.query.status;
    }
    if (req.query.attributes && Object.keys(req.query.attributes).length !== 0) {
        Object.keys(req.query.attributes).forEach(function (key) {
            var val = req.query.attributes[key].split(',');
            queryObj["attributes." + key] = val;
        });
    }
    var qTags = [];
    if (req.query.qTags && req.query.qTags !== '') {
        var val = req.query.qTags.split(',');
        val.forEach(function (qTag) {
            qTags.push({ "qTags": qTag });
        });
    }
    if (req.query.provider && req.query.provider !== '') {
        await Provider
            .find({ name: req.query.provider })
            .then((provider) => {
                if (provider.length) {
                    queryObj["providerID"] = provider[0].providerID;
                }
                else {
                    return res.status(404).send({
                        status: 404,
                        message: "No Such Provider Exists. Cannot proceed to find products."
                    });
                }
            })
            .catch((err) => catchDBErr(err, res))

    }
    if (qTags.length !== 0) {
        queryObj["$or"] = qTags;
    }
    Product
        .find(queryObj)
        .select(['-_id', '-__v'])
        .skip(pageOptions.offset)
        .limit(pageOptions.limit)
        .then((product) => {
            if (product.length) {
                return res.status(200).send(product);
            }
            return res.status(404).send({
                status: 404,
                message: "No Such Products Found."
            });
        })
        .catch((err) => catchDBErr(err, res))
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
        .catch((err) => catchDBErr(err, res))
};

exports.getProduct = async (req, res) => {
    Product
        .find({ sku: req.params.sku })
        .select(['-_id', '-__v'])
        .then((product) => {
            if (product.length) {
                return res.status(200).send(product);  
            }
            return res.status(404).send({
                status: 404,
                message: "Product not found with sku: " + req.params.sku
            });
        })
        .catch((err) => catchDBErr(err, res))
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
    Product
        .findOneAndUpdate({ sku: req.params.sku }, req.body, { new: true })
        .select(['-_id', '-__v'])
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
            catchDBErr(err, res)
        })
};

exports.deleteProduct = async (req, res) => {
    Product
        .findOneAndRemove({ sku: req.params.sku })
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
        .catch((err) => catchDBErr(err, res))
};

exports.getSimilarProducts = async (req, res) => {
    Product
        .find({ sku: req.params.sku })
        .then((product) => {
            if (product.length) {
                if (product[0].qTags.length) {
                    var qTags = [];
                    const queryObj = {};
                    product[0].qTags.forEach(function (qTag) {
                        qTags.push({ "qTags": qTag });
                    });
                    queryObj["$and"] = [];
                    queryObj["$and"].push({ "sku": { "$ne": product[0].sku } });
                    queryObj["$and"].push({ "$or": qTags });
                    //queryObj["$or"] = qTags;
                    Product
                        .find(queryObj)
                        .and([])
                        .select(['-_id', '-__v'])
                        .then((product) => {
                            if (product.length) {
                                return res.status(200).send(product);
                            }
                        })
                        .catch((err) => catchDBErr(err, res))
                }
                else {
                    return res.status(404).send({
                        status: 404,
                        message: "No Similar Products Found based on qTags."
                    });
                }
            }
            else {
                return res.status(404).send({
                    status: 404,
                    message: "Product not found with sku: " + req.params.sku
                });
            }
        })
        .catch((err) => catchDBErr(err, res))
};