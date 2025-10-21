const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const reviewSchema = require("../schemas/reviewSchema");

const Review = new mongoose.model("Review", reviewSchema);

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST a review
router.post("/", async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add review" });
  }
});

module.exports = router;
