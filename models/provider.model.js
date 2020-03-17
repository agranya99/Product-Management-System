const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var validateURL = function (url) {
    var re = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return re.test(url);
};

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};


var ProviderSchema = new Schema({
    providerID: { type: Number, required: true, unique: true, min: 0 },
    name: { type: String, required: true, maxlength: 50 },
    website: { type: String, validate: [validateURL, 'Invalid URL'], maxlength: 100 },
    email: { type: String, validate: [validateEmail, 'Invalid e-mail address'], maxlength: 50 }
});

module.exports = mongoose.model('Provider', ProviderSchema);