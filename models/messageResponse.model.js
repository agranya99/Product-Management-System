const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var MessageResponseSchema = new Schema({
    status: { type: String, required: true, maxlength: 20 },
    message: { type: String, required: true, maxlength: 50 }
});

module.exports = mongoose.model('MessageResponse', MessageResponseSchema);