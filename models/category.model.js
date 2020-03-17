const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CategorySchema = new Schema({
    categoryID: { type: Number, required: true, unique: true, min: 0 },
    name: { type: String, required: true, maxlength: 50 },
    parentCategoryID: {type: Number, min: -1, default: -1}
});

module.exports = mongoose.model('Category', CategorySchema);