const express = require("express");
const router = express.Router();
const todoSchema =require('../schemas/todoSchema');
const mongoose  = require("mongoose");
const Todo = new mongoose.model("Todo",todoSchema);

// get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});
 
// get single todo
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

//Post todo
router.post('/', async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.status(200).json({
      message: "Todo inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      details: err.message,
    });
  }
});


// Post multiple todos
router.post('/all', async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        error: "Request body must be a non-empty array of todos",
      });
    }

    const todos = await Todo.insertMany(req.body);
    res.status(201).json({
      message: "Todos inserted successfully",
      count: todos.length

    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server-side error while inserting multiple todos",
      details: err.message,
    });
  }
});


// put todo
router.put('/:id', async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Todo not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// delete todo
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Todo not found" });
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = router;