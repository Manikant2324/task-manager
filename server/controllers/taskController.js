const Task =
require("../models/Task");

const createTask =
async (req, res) => {

  try {

    const files =
      req.files?.map(
        (file) =>
        file.filename
      ) || [];

    const task =
      await Task.create({

        ...req.body,

        documents: files,

        createdBy:
          req.user.id,

      });

    res.status(201).json(task);

  }

  catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};

const getTasks =
async (req, res) => {

  try {

    const {

      status,
      priority,

      page = 1,
      limit = 5,

      sort = "createdAt",

    } = req.query;

    let filter = {};

    if (
      req.user.role !==
      "admin"
    ) {

      filter.createdBy =
        req.user.id;

    }

    if (status) {

      filter.status =
        status;

    }

    if (priority) {

      filter.priority =
        priority;

    }

    const tasks =
      await Task.find(filter)

        .populate(
          "assignedTo",
          "email"
        )

        .sort(sort)

        .skip(
          (page - 1) * limit
        )

        .limit(
          Number(limit)
        );

    res.json(tasks);

  }

  catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};

const getTaskById =
async (req, res) => {

  try {

    const task =
      await Task.findById(
        req.params.id
      );

    res.json(task);

  }

  catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};

const updateTask =
async (req, res) => {

  try {

    const updatedTask =

      await Task.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
        }

      );

    res.json(updatedTask);

  }

  catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};

const deleteTask =
async (req, res) => {

  try {

    await Task.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Task deleted",
    });

  }

  catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};

module.exports = {

  createTask,

  getTasks,

  getTaskById,

  updateTask,

  deleteTask,

};