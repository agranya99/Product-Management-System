const Product = require('../models/product.model');

exports.createProduct = async (req, res) => {
    const product = new Product(req.body);

    product.save()
        .then((product) => {
            return res.status(200).send({ sku: product.sku, status: 200, message: "Product Created Successfully" });
        })
        .catch((err) => {
            if(err.name === "MongoError" || err.name == "ValidationError")
                return res.status(400).send({ status: 400, message: err.message });

            return res.status(500).send({ status: 500, message: "Oops! Internal server error." });
        })
    /*product.save(function (err) {
        if (err) {
            if (err.code === 11000)
                res.send({ status: err.code, message: err.errmsg });
            else
                res.status(400).send({ status: "Invalid Request", message: err.message });
        }
        else {
            var response = { sku: req.body.sku, message: 'Product Created successfully' };
            res.status(200).send(response);
        }
    })*/
};
