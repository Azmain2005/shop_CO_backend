const express = require("express");
const router = express.Router();
const productSchema =require('../schemas/productSchema');
const mongoose  = require("mongoose");
const Product = new mongoose.model("Product",productSchema);
const checkLogin = require("../middlewares/checkLogin");


// get all Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).populate('brand').populate("collections").populate("tax").populate("categorie"); //  populate brand,collection data
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Products" });
  }
});
 
// get single Product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('brand').populate("collections").populate("tax").populate("categorie"); // populate brand,colletion data
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Product" });
  }
});

// Get products by page with filtering and sorting
router.get('/page/:pageNumber', async (req, res) => {
  try {
    const page = parseInt(req.params.pageNumber) || 1;
    const limit = 3; // <--- CHANGE THIS TO 5
    const skipIndex = (page - 1) * limit;

    const { brand, minPrice, maxPrice, sort } = req.query;
    let query = {};

    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.selling = { 
        $gte: Number(minPrice) || 0, 
        $lte: Number(maxPrice) || 999999 
      };
    }

    // Sorting logic
    let sortOptions = { _id: -1 };
    if (sort === "low-high") sortOptions = { selling: 1 };
    if (sort === "high-low") sortOptions = { selling: -1 };

    const products = await Product.find(query)
      .populate('brand collections tax categorie')
      .sort(sortOptions)
      .limit(limit)
      .skip(skipIndex);

    // CRITICAL: You must count with the SAME query to get accurate pagination
    const totalCount = await Product.countDocuments(query);

    res.status(200).json({
      data: products,
      totalPages: Math.ceil(totalCount / limit), // e.g., 12 products / 5 = 3 pages
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//Post Product
// Post Product
router.post('/', checkLogin, async (req, res) => {
  try {
    // 1. Destructure the body to handle attributes specifically if needed
    const { attributes, ...otherData } = req.body;

    // 2. Ensure attributes are formatted correctly as objects with prices
    const formattedAttributes = attributes?.map(attr => ({
      title: attr.title,
      values: attr.values.map(v => ({
        val: v.val,
        price: Number(v.price) || 0 // Ensure price is saved as a Number
      }))
    }));

    // 3. Create the product with the formatted attributes
    const newProduct = new Product({
      ...otherData,
      attributes: formattedAttributes
    });

    await newProduct.save();
    
    res.status(200).json({
      message: "Product inserted successfully",
    });
  } catch (err) {
    console.error("Mongoose Save Error:", err); // This will show in your terminal
    res.status(500).json({
      error: "There was a server side error",
      details: err.message, // This helps you see the exact field failing in the frontend console
    });
  }
});

// Post multiple Products
router.post('/all',checkLogin, async (req, res) => {
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
router.put('/:id', checkLogin, async (req, res) => {
  try {
    const { attributes, ...otherData } = req.body;

    // Format attributes for update
    const updateData = { ...otherData };
    if (attributes) {
      updateData.attributes = attributes.map(attr => ({
        title: attr.title,
        values: attr.values.map(v => ({
          val: v.val,
          price: Number(v.price) || 0
        }))
      }));
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true } // runValidators ensures the new schema is respected
    );

    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Product", details: err.message });
  }
});

// delete Product
router.delete('/:id',checkLogin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Product" });
  }
});

module.exports = router;