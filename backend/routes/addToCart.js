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

router.get("/getCart", (req, res) => {
	var user = req.query.user;
	CartsModel
		.findOne({
			user: user
		})
		.exec((err, entry) => {
			if (err) {
				console.log(err);
				return res.status(500).send(err)
			}
			console.log(entry)
			return res.status(200).send(entry);
		});
})

async function cartAdd(itemToAdd,user, res) {
	// let currentCart;
	console.log(user);
	let currentCart = await CartsModel
		.findOne({
			user: user
		})
	console.log(`Current cart before update: ${currentCart}`);
	if (currentCart != null) {
		console.log("Current cart not empty!")
		let itemFound = false;
		currentCart.items.forEach((item) => {
			console.log(`${itemToAdd.productID} ${item.productID}`)
			if (itemToAdd.productID === item.productID) {
				itemFound = true;
				item.quantity += 1;
			}
		});
		if (!itemFound) {
			console.log("Item not found in Cart");
			currentCart.items.push(itemToAdd);
		}
	} else {
		currentCart = new CartsModel({
			user: user,
			items: [
				itemToAdd
			]
		})
	}
	let newCurrentCart = {
		user: currentCart.user,
		items: currentCart.items
	}
	console.log(`Current cart after update: ${newCurrentCart.items}`);
	await CartsModel.updateOne({ user: user }, newCurrentCart, { upsert: true }, () => {
		console.log("Write Success");
		return res.status(200).send({ "status": "success" });
	}) 
	// return res.status(401).send({ "status": "failed" });
}


router.get("/secureAddToCart", async (req, res) => {
	let user = req.query.user;
	let ID = req.query.productID;
	let product = await ProductsModel.findOne({ id: ID })
	if(product != null) {
		let itemToAdd = {
			productID: ID,
			price: product.price,
			name: product.name,
			quantity: 1,
			imageURL: product.imageURL
		};
		await cartAdd(itemToAdd, user, res);
	} else {
		return res.status(401).send({"status":"product not found"})
	}
});

router.get("/addToCart", async (req, res) => {
	let user = req.query.user;
	let itemToAdd = {
		productID: req.query.productID,
		price: req.query.price,
		name: req.query.name,
		quantity: 1,
		imageURL: req.query.imageURL
	};
	console.log(`Item to be added: ${itemToAdd.name}`);
	await cartAdd(itemToAdd, user, res);
})

module.exports = router