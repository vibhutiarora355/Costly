
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var product = new Schema(
{
    id: String,
    name: String,
    price: Number,
    description: String,
    imageURL: String,
    category: String
  });

//Export model
module.exports = mongoose.model('products', product);