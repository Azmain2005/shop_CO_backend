const express = require("express");
const router = express.Router();
const orderSchema = require('../schemas/orderSchema');
const mongoose = require("mongoose");
const Order = new mongoose.model("Order", orderSchema);

// get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: 'cartId',               // 1. Populate the Cart
        populate: {
          path: 'products.product',   // 2. Inside Cart, populate the product field in the products array
          model: 'Product'            // Ensure this matches your Product model name
        }
      });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'cartId',               // 1. Populate the Cart
        populate: {
          path: 'products.product',   // 2. Inside Cart, populate the product field in the products array
          model: 'Product'            // Ensure this matches your Product model name
        }
      });
    if (!order) return res.status(404).json({ error: "order not found" });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

//Post order
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(200).json({
      message: "Order inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      details: err.message,
    });
  }
});


// Post multiple orders
router.post('/all', async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        error: "Request body must be a non-empty array of orders",
      });
    }

    const orders = await Order.insertMany(req.body);
    res.status(201).json({
      message: "Orders inserted successfully",
      count: orders.length

    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server-side error while inserting multiple orders",
      details: err.message,
    });
  }
});


// put order
router.put('/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "order not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Order" });
  }
});

// delete order
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Order" });
  }
});

module.exports = router;