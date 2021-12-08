
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var product = new Schema(
{
    "productID": String,
    "price": Number,
    "name": String
  });

//Export model
module.exports = mongoose.model('product', product);