const express = require("express");
const router = express.Router();
const List = require("../models/List");
const Todo = require("../models/Todo");
const { isAuth } = require("../utils/authcheck");

// Get All the Lists
router.get("/", isAuth, (req, res) => {
  List.find()
    .sort({ date: -1 })
    .populate("user")
    .then((lists) => res.json(lists));
});

// Make a new List
router.post("/", isAuth, (req, res) => {
  newList = new List({
    name: req.body.name,
    user: req.session.user.id
  });

  console.log(req.session.user.id);
  newList.save().then((list) => res.json(list));
});

// Add a new ToDo to the list
// This is an Atomic Operation
router.post("/todo/:id", isAuth, (req, res) => {
  newTodo = new Todo({
    name: req.body.name
  });
  List.findOneAndUpdate(
    { _id: req.params.id, user: req.session.user.id },
    {
      $push: { todos: newTodo }
    },
    { new: true } // This option returns the modified document, not the original one
  ).then((list) => res.json(list));
});

// Delete a single Todo from a given list
// This is an Atomic Operation
router.delete("/todo/:id", isAuth, (req, res) => {
  List.findOneAndUpdate(
    { _id: req.params.id, user: req.session.user.id },
    {
      $pull: { todos: { _id: req.body.id } } // Deletes the todo using it's id from request body
    },
    { new: true }
  ).then((list) => res.json(list));
});

module.exports = router;
