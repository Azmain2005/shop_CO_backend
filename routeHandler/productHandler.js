const express = require("express");
const router = express.Router();
const productSchema =require('../schemas/productSchema');
const mongoose  = require("mongoose");
const Product = new mongoose.model("Product",productSchema);

// get all Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).populate('brand').populate("collections").populate("tax").populate("categorie").populate("attribute"); //  populate brand,collection data
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Products" });
  }
});
 
// get single Product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('brand').populate("collections").populate("tax").populate("categorie").populate("attribute"); // populate brand,colletion data
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Product" });
  }
});


//Post Product
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(200).json({
      message: "Product inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      details: err.message,
    });
  }
});


// Post multiple Products
router.post('/all', async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        error: "Request body must be a non-empty array of Products",
      });
    }

    const products = await Product.insertMany(req.body);
    res.status(201).json({
      message: "Products inserted successfully",
      count: products.length

    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server-side error while inserting multiple Products",
      details: err.message,
    });
  }
});


// put Product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Product" });
  }
});

// delete Product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Product" });
  }
});

module.exports = router;