var mongoose = require('mongoose');
const express = require("express")
require('dotenv').config()

var ProductsModel = require('../models/product.js');
var CartsModel = require('../models/cart.js');

function connectToDB() {
    //Set up mongoose connection
    var mongoDB = process.env.DB_URL;
    mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  }

connectToDB();
const router = express.Router()

router.get("/getCart", (req,res) => {
    var user = req.user;
    CartsModel
  .find({
    user: user
  })
  .exec((err, entry) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err)
    }
    return res.status(200).send(entry);
  }); 
})

router.get("/addToCart", async (req,res) => {
    let user = req.query.user;
    let ID = req.query.productID;
    let price = req.query.price;
    let name = req.query.name;
    // "user":user,
    // let product = new ProductsModel({
    //     "productID": ID,
    //     "price": price,
    //     "name": name
    // });

    let currentCart = new CartsModel({
        user:user,
        items:[
            {
                productID:ID,
                price:price,
                name:name
            }
        ],
        quantity:1
    });
    console.log(currentCart);
    // await CartsModel
    //     .find({
    //         user: user
    //     })
    //     .exec((err, entry) => {
    //         if (err) {
    //         console.log(err);
    //         }
    //         currentCart = entry;
    //     });
    // console.log(currentCart);
    // currentCart.items.append(product);
  await currentCart.save();
  return res.status(200).send({"status":"success"});
    //ProductsModel.updateOne({gatewayID: gatewayID,nodeID:nodeID}, data, {upsert: true},()=>{
    //   console.log("Write success");
    // });
})

module.exports = router