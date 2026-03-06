// routeHandler/cartHandler.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cartSchema = require("../schemas/cartSchema");

const Cart = new mongoose.model("Cart", cartSchema);

// ✅ GET all carts
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find({})
      .populate("user")
      .populate("products.product");
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch carts", details: err.message });
  }
});

// ✅ GET single cart by ID
router.get("/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id)
      .populate("user")
      .populate("products.product");

    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart", details: err.message });
  }
});

// POST add/update cart
router.post("/", async (req, res) => {
  try {
    const { user } = req.body;

    let cart = await Cart.findOne({
      user,
      cartStatus: "editing",
    });

    if (!cart) {
      cart = await Cart.create({
        user,
        products: [],
        cartStatus: "editing",
      });
    }

    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET cart which is on editing by userId
router.get("/specificcart/:id", async (req, res) => {
  try {
    const cartId = req.params.id; // this is the MongoDB user _id

    // Find cart for this user where status is "editing"
    const cart = await Cart.findOne({
      _id: cartId,
      cartStatus: "editing",
    })
      .populate("products.product")
      .populate("user");

    if (!cart) {
      return res.status(404).json({ error: "Cart not found or not in editing status" });
    }

    res.status(200).json({
      message: "Cart found successfully",
      cart, // send the whole cart object or just cart._id if you want
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ✅ POST multiple carts
router.post("/all", async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Request body must be a non-empty array" });
    }

    const carts = await Cart.insertMany(req.body);
    res.status(201).json({
      message: "Carts inserted successfully",
      count: carts.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to insert multiple carts",
      details: err.message,
    });
  }
});

// ✅ PUT update cart
const normalizeAttributes = (attrs = {}) => {
  if (attrs instanceof Map) {
    attrs = Object.fromEntries(attrs);
  }

  return JSON.stringify(
    Object.keys(attrs)
      .sort()
      .reduce((acc, key) => {
        acc[key] = attrs[key];
        return acc;
      }, {})
  );
};


// ✅ ADD / UPDATE product in cart
router.put("/:id", async (req, res) => {
  try {
    const { product, count = 1, attributes = {} } = req.body;

    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const incomingAttrs = normalizeAttributes(attributes);

    const existingItem = cart.products.find((p) => {
      return (
        p.product.toString() === product &&
        normalizeAttributes(p.attributes) === incomingAttrs
      );
    });

    if (existingItem) {
      existingItem.count += count;
    } else {
      cart.products.push({
        product,
        count,
        attributes,
      });
    }

    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//DELETE product on cart
router.put("/deleteproductcart/:id", async (req, res) => {
  try {
    const { product, attributes = {} } = req.body;
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    const incomingAttrs = normalizeAttributes(attributes);
    const initialLength = cart.products.length;

    cart.products = cart.products.filter((p) => {
      return !(
        p.product.toString() === product &&
        normalizeAttributes(p.attributes) === incomingAttrs
      );
    });
    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})


//Increase count of product on cart 
router.put("/editproductcart/:id", async (req, res) => {
  try {
    const { product, count, attributes = {} } = req.body;
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    const incomingAttrs = normalizeAttributes(attributes);
    // Find the matching product in cart
    const item = cart.products.find(
      (p) =>
        p.product.toString() === product &&
        normalizeAttributes(p.attributes) === incomingAttrs
    );
    if (!item) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Update the count
    item.count = count; // or: item.count += count; for increment

    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})




// ✅ UPDATE only the cart status by ID
router.put("/update-status/:id", async (req, res) => {
  try {
    const { cartStatus } = req.body;

    // 1. Basic validation to ensure a status was actually sent
    if (!cartStatus) {
      return res.status(400).json({ error: "cartStatus is required in the request body" });
    }

    // 2. Find by ID and update the status field only
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: { cartStatus } },
      { 
        new: true,           // Returns the updated document instead of the old one
        runValidators: true  // Validates against your Schema enum (editing/pending/finished)
      }
    );

    // 3. Handle case where ID doesn't exist
    if (!updatedCart) {
      return res.status(404).json({ error: "No cart found with that ID" });
    }

    res.status(200).json({
      message: `Cart status updated to ${cartStatus}`,
      cartId: updatedCart._id,
      newStatus: updatedCart.cartStatus
    });

  } catch (err) {
    // This will catch validation errors (e.g., if you sent "shipped" which isn't in your enum)
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});




// ✅ DELETE cart
router.delete("/:id", async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedCart) return res.status(404).json({ error: "Cart not found" });
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete cart", details: err.message });
  }
});


module.exports = router;
