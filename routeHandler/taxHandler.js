const express = require("express");
const router = express.Router();
const taxSchema =require('../schemas/taxruleSchema');
const mongoose  = require("mongoose");
const Tax = new mongoose.model("Tax",taxSchema);

// get all Tax
router.get('/', async (req, res) => {
  try {
    const taxs = await Tax.find({});
    res.status(200).json(taxs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Tax" });
  }
});
 
// get single Tax
router.get('/:id', async (req, res) => {
  try {
    const tax = await Tax.findById(req.params.id);
    if (!tax) return res.status(404).json({ error: "Tax not found" });
    res.status(200).json(tax);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Tax" });
  }
});

//Post Tax
router.post('/', async (req, res) => {
  try {
    const newTax = new Tax(req.body);
    await newTax.save();
    res.status(200).json({
      message: "Tax inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      details: err.message,
    });
  }
});


// Post multiple Taxs
router.post('/all', async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        error: "Request body must be a non-empty array of Taxs",
      });
    }

    const taxs = await Tax.insertMany(req.body);
    res.status(201).json({
      message: "Tax inserted successfully",
      count: taxs.length

    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server-side error while inserting multiple Tax",
      details: err.message,
    });
  }
});


// put Tax
router.put('/:id', async (req, res) => {
  try {
    const updated = await Tax.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Tax not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Tax" });
  }
});

// delete Tax
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Tax.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Tax not found" });
    res.status(200).json({ message: "Tax deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Tax" });
  }
});

module.exports = router;