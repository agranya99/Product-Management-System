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

    // 500: DB connection issues... 
    return res.status(500).send({
        status: 500,
        message: "Oops! Internal server error."
    });
}

exports.filterProviders = async (req, res) => {
    const pageOptions = {
        offset: parseInt(req.query.offset, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 10
    }
    const queryObj = {};

    if (req.query.name && req.query.name !== '') {
        queryObj["name"] = req.query.name;
    }
    if (req.query.email && req.query.email !== '') {
        queryObj["email"] = req.query.email;
    }
    Provider.find(queryObj)
        .skip(pageOptions.offset)
        .limit(pageOptions.limit)
        .select(['-_id', '-__v'])
        .then((provider) => {
            if (provider.length) {
                return res.status(200).send(provider);
            }
            return res.status(404).send({
                status: 404,
                message: "No Such Providers Found."
            });
        })
        .catch((err) => catchDBErr(err, res))
};

exports.createProvider = async (req, res) => {
    const provider = new Provider(req.body);

    provider.save()
        .then((provider) => {
            return res.status(200).send({
                providerID: provider.providerID,
                status: 200,
                message: "Provider Created Successfully"
            });
        })
        .catch((err) => catchDBErr(err, res))
};

exports.getProvider = async (req, res) => {
    Provider.find({ providerID: req.params.providerID })
        .select(['-_id', '-__v'])
        .then((provider) => {
            if (provider.length) {
                return res.status(200).send(provider);
            }
            return res.status(404).send({
                status: 404,
                message: "Provider not found with providerID: " + req.params.providerID
            });
        })
        .catch((err) => catchDBErr(err, res))
};

exports.updateProvider = async (req, res) => {
    // Validate Request
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            status: 400,
            message: "Request Body cannot be empty"
        });
    }
    // Find and update category with the request body
    Provider.findOneAndUpdate({ providerID: req.params.providerID }, req.body, { new: true })
        .select(['-_id', '-__v'])
        .then((provider) => {
            if (!provider) {
                return res.status(404).send({
                    status: 404,
                    message: "Provider not found with providerID: " + req.params.providerID
                });
            }
            return res.send(provider);
        })
        .catch((err) => catchDBErr(err, res))
};

exports.deleteProvider = async (req, res) => {
    Provider.findOneAndRemove({ providerID: req.params.providerID })
        .then((provider) => {
            if (!provider) {
                return res.status(404).send({
                    status: 404,
                    message: "Provider not found with providerID: " + req.params.providerID
                });
            }
            return res.status(200).send({
                providerID: provider.providerID,
                status: 200,
                message: "Provider deleted successfully"
            });
        })
        .catch((err) => catchDBErr(err, res))
};
