const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

// OAuth Middleware
const authMiddleware = require('./middlewares/auth');
// routes for the products
const product = require('./routes/product.route'); 
// routes for the categories
const category = require('./routes/category.route'); 
// routes for the providers
const provider = require('./routes/provider.route');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// OAuth2.0 middleware
app.use(authMiddleware);

// Connect to MongoDB Atlas Database
mongoose.connect('mongodb://pmsTest:pmsTest1234@cluster0-shard-00-00-z7lhh.mongodb.net:27017,cluster0-shard-00-01-z7lhh.mongodb.net:27017,cluster0-shard-00-02-z7lhh.mongodb.net:27017/pms?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .catch(error => console.log(error));

app.use('/products', product);
app.use('/categories', category);
app.use('/providers', provider);

const listOfEndpoints = [
    '/',
    '/products',
    '/products/:sku',
    '/products/:sku/similar',
    '/categories',
    '/categories/:categoryID',
    '/categories/:categoryID/subCategories',
    '/categories/:categoryID/products',
    '/providers',
    '/providers/:providerID',
    'Search Query Sample: GET /products?limit=10&offset=0&qTags=gaming,mouse&attributes[colors]=white,silver',
    'Search Query Sample: GET /categories?name=Peripherals',
    'Search Query Sample: GET /providers?name=Razer'
]

app.get('/', (req, res) => {
    res.send({ 'endpoints': listOfEndpoints })
});

app.get('*', (req, res) => {
    res.status(404).send({
        'status': 404,
        'message': 'Invalid URL',
        'endpoints': listOfEndpoints
    })
});

app.post('*', (req, res) => {
    res.status(404).send({
        'status': 404,
        'message': 'Invalid URL',
        'endpoints': listOfEndpoints
    })
});

app.put('*', (req, res) => {
    res.status(404).send({
        'status': 404,
        'message': 'Invalid URL',
        'endpoints': listOfEndpoints
    })
});

app.delete('*', (req, res) => {
    res.status(404).send({
        'status': 404,
        'message': 'Invalid URL',
        'endpoints': listOfEndpoints
    })
});


var port = 3000;
app.listen(port, () => {
    console.log('Server is up and running on port: ' + port);
});

