const express = require("express");
const router = express.Router();
const categorieSchema =require('../schemas/categorieSchema');
const mongoose  = require("mongoose");
const Categorie = new mongoose.model("Categorie",categorieSchema);

// get all Categories
router.get('/', async (req, res) => {
  try {
    const categorie = await Categorie.find({});
    res.status(200).json(categorie);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Categorie" });
  }
});
 
// get single categorie
router.get('/:id', async (req, res) => {
  try {
    const categorie = await Categorie.findById(req.params.id);
    if (!categorie) return res.status(404).json({ error: "categorie not found" });
    res.status(200).json(categorie);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categorie" });
  }
});

//Post categorie
router.post('/', async (req, res) => {
  try {
    const newcategorie = new Categorie(req.body);
    await newcategorie.save();
    res.status(200).json({
      message: "newcategorie inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      details: err.message,
    });
  }
});


// Post multiple categories
router.post('/all', async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        error: "Request body must be a non-empty array of categories",
      });
    }

    const categories = await Categorie.insertMany(req.body);
    res.status(201).json({
      message: "categories inserted successfully",
      count: categories.length

    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server-side error while inserting multiple categories",
      details: err.message,
    });
  }
});


// put categorie
router.put('/:id', async (req, res) => {
  try {
    const updated = await Categorie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "categorie not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update categorie" });
  }
});

// delete categorie
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Categorie.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "categorie not found" });
    res.status(200).json({ message: "categorie deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete categorie" });
  }
});

module.exports = router;