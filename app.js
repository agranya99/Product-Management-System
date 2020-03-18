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
app.use(authMiddleware);

mongoose.connect('mongodb://pmsTest:pmsTest1234@cluster0-shard-00-00-z7lhh.mongodb.net:27017,cluster0-shard-00-01-z7lhh.mongodb.net:27017,cluster0-shard-00-02-z7lhh.mongodb.net:27017/pms?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .catch(error => console.log(error));

app.use('/products', product);
app.use('/categories', category);
app.use('/providers', provider);

var port = 3000;
app.listen(port, () => {
    console.log('Server is up and running on port: ' + port);
});

