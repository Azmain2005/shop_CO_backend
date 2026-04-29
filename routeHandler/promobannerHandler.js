const express = require("express");
const router = express.Router();
const promobannerSchema =require('../schemas/promobannerSchema');
const mongoose  = require("mongoose");
const Promobanner = new mongoose.model("Promobanner",promobannerSchema);
const checkLogin = require("../middlewares/checkLogin");


// get all Promobanner
router.get('/', async (req, res) => {
  try {
    const promobanners = await Promobanner.find({});
    res.status(200).json(promobanners);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Promobanner" });
  }
});
 
//Post Promobanner
router.post('/',checkLogin, async (req, res) => {
  try {
    const newPromobanner = new Promobanner(req.body);
    await newPromobanner.save();
    res.status(200).json({
      message: "Promobanner inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      details: err.message,
    });
  }
});


// put Promobanner
router.put('/:id',checkLogin, async (req, res) => {
  try {
    const updated = await Promobanner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Promobanner not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Promobanner" });
  }
});


module.exports = router;