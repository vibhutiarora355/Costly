
var mongoose = require('mongoose');
const productSchema = require('./product.js');
var Schema = mongoose.Schema;
var cart = new Schema(
{
    user: String,
    items: [{
        productID: String,
        price: Number,
        name: String
    }],
    quantity: Number
});
//Export model
module.exports = mongoose.model('cart', cart);