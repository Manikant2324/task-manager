import express from "express";

const router = express.Router();

let tasks = [];

router.get("/", (req, res) => {

  res.json(tasks);

});

router.post("/", (req, res) => {

  const newTask = {

    _id: Date.now(),

    title: req.body.title,

    description: req.body.description,

    priority: req.body.priority,

    status: req.body.status,

  };

  tasks.push(newTask);

  res.json(newTask);

});

export default router;