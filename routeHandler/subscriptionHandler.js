const express = require("express");
const router = express.Router();
const subscriptionSchema =require('../schemas/subscriptionSchema');
const mongoose  = require("mongoose");
const Subscription = new mongoose.model("Subscription",subscriptionSchema);

// get all Subscriptions
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find({});
    res.status(200).json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Subscriptions." });
  }
});
 
// get single Subscription
router.get('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ error: "Subscription not found" });
    res.status(200).json(subscription);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
});

//Post Subscription
router.post('/', async (req, res) => {
  try {
    const newSubscription = new Subscription(req.body);
    await newSubscription.save();
    res.status(200).json({
      message: "Subscription inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      details: err.message,
    });
  }
});


// Post multiple Subscriptions
router.post('/all', async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        error: "Request body must be a non-empty array of Subscriptions",
      });
    }

    const subscriptions = await Subscription.insertMany(req.body);
    res.status(201).json({
      message: "Subscriptions inserted successfully",
      count: subscriptions.length

    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server-side error while inserting multiple Subscriptions",
      details: err.message,
    });
  }
});


// put Subscription
router.put('/:id', async (req, res) => {
  try {
    const updated = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Subscription not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Subscription" });
  }
});

// delete Subscription
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Subscription.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Subscription not found" });
    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Subscription" });
  }
});

module.exports = router;