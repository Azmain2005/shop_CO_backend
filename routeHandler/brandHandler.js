const express = require("express");
const router = express.Router();
const brandSchema =require('../schemas/brandSchema');
const mongoose  = require("mongoose");
const Brand = new mongoose.model("Brand",brandSchema);

// get all Brand
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.status(200).json(brands);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Brands" });
  }
});
 
// get single Brand
router.get('/:id', async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.status(200).json(brand);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Brand" });
  }
});

//Post Brand
router.post('/', async (req, res) => {
  try {
    const newBrand = new Brand(req.body);
    await newBrand.save();
    res.status(200).json({
      message: "Brand inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      details: err.message,
    });
  }
});


// Post multiple Brand
router.post('/all', async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        error: "Request body must be a non-empty array of Brands",
      });
    }

    const brands = await Brand.insertMany(req.body);
    res.status(201).json({
      message: "Brand inserted successfully",
      count: brands.length

    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server-side error while inserting multiple Brands",
      details: err.message,
    });
  }
});


// put Brand
router.put('/:id', async (req, res) => {
  try {
    const updated = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Brand not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Brand" });
  }
});

// delete Brand
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Brand.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Brand not found" });
    res.status(200).json({ message: "ToBranddo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Brand" });
  }
});

module.exports = router;