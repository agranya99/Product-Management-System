const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProductSchema = new Schema({
    sku: { type: String, required: true, unique: true, minlength: 8, maxlength: 8 },
    name: { type: String, required: true, maxlength: 50 },
    categoryID: { type: Number, required: true, min: 0 },
    qTags: { type: Array, default: [] },
    attributes: {},
    price: { type: Number, required: true, min: 0 },
    imageURLs: { type: Array, default: [] },
    providerID: { type: Number, min: 0, default: 0 },
    launchDate: { type: Date },
    stock: { type: Number, min: 0 },
    status: { type: String, enum: ['available', 'pipeline'], required: true, default: 'available' }
});

module.exports = mongoose.model('Product', ProductSchema);