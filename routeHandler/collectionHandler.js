const express = require("express");
const router = express.Router();
const collectionSchema =require('../schemas/collectionSchema');
const mongoose  = require("mongoose");
const Collection = new mongoose.model("Collection",collectionSchema);

// get all Collection
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find({});
    res.status(200).json(collections);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Collections" });
  }
});
 
// get single Collection
router.get('/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ error: "Collection not found" });
    res.status(200).json(collection);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Collection" });
  }
});

//Post Collection
router.post('/', async (req, res) => {
  try {
    const newCollection = new Collection(req.body);
    await newCollection.save();
    res.status(200).json({
      message: "Collection inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      details: err.message,
    });
  }
});


// Post multiple Collections
router.post('/all', async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        error: "Request body must be a non-empty array of Collectiona",
      });
    }

    const collections = await Collection.insertMany(req.body);
    res.status(201).json({
      message: "Collections inserted successfully",
      count: collections.length

    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server-side error while inserting multiple Collections",
      details: err.message,
    });
  }
});


// put Collection
router.put('/:id', async (req, res) => {
  try {
    const updated = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Collection not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Collection" });
  }
});

// delete Collection
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Collection.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Collection not found" });
    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Collection" });
  }
});

module.exports = router;