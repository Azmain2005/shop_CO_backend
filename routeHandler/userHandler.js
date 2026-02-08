const express = require("express");
const router = express.Router();
const User = require("../schemas/userSchema");

// ✅ GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ GET single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ✅ GET user id by googleid
router.get("/google/:googleid", async (req, res) => {
  try {
    const { googleid } = req.params;

    const user = await User.findOne({ googleid }).select("_id");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({message: "User found successfully", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ✅ POST  user
router.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });

  } catch (err) {
    console.error("POST /user error:", err);
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});






// ✅ POST multiple users (batch insert)
router.post("/all", async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        error: "Request body must be a non-empty array of users",
      });
    }

    const users = await User.insertMany(req.body);
    res.status(201).json({
      message: "Users inserted successfully",
      count: users.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server-side error while inserting multiple users",
      details: err.message,
    });
  }
});

// ✅ PUT (update user)
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ✅ DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
