const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const attributeSchema = require("../schemas/AttributeSchema");

// Create Model from Schema
const Attribute = new mongoose.model("Attribute", attributeSchema);

// 🟢 Get all attributes
router.get("/", async (req, res) => {
  try {
    const attributes = await Attribute.find({});
    res.status(200).json(attributes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attributes", details: err.message });
  }
});

// 🟢 Get single attribute
router.get("/:id", async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) return res.status(404).json({ error: "Attribute not found" });
    res.status(200).json(attribute);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attribute", details: err.message });
  }
});

// 🟢 Post single attribute
router.post("/", async (req, res) => {
  try {
    const newAttribute = new Attribute(req.body);
    await newAttribute.save();
    res.status(201).json({ message: "Attribute inserted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error while inserting attribute", details: err.message });
  }
});

// 🟢 Post multiple attributes
router.post("/all", async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Request body must be a non-empty array of attributes" });
    }

    const result = await Attribute.insertMany(req.body);
    res.status(201).json({ message: "Attributes inserted successfully", count: result.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to insert multiple attributes", details: err.message });
  }
});

// 🟢 Update attribute
router.put("/:id", async (req, res) => {
  try {
    const updated = await Attribute.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Attribute not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update attribute", details: err.message });
  }
});

// 🟢 Delete attribute
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Attribute.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Attribute not found" });
    res.status(200).json({ message: "Attribute deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete attribute", details: err.message });
  }
});

module.exports = router;
