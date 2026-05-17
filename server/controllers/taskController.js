const Task =
require("../models/Task");

const createTask =
async (req, res) => {

  try {

    const files =
      req.files?.map((file) => file.filename) || [];

    const assignedTo =
      req.user.role === "admin" && req.body.assignedTo
        ? req.body.assignedTo
        : req.user.id;

    const task =
      await Task.create({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || "pending",
        priority: req.body.priority || "medium",
        dueDate: req.body.dueDate,
        assignedTo,
        documents: files,
        createdBy: req.user.id,
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
      dueDate,
      dueDateFrom,
      dueDateTo,
      assignedTo,

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

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (dueDate) {
      filter.dueDate = new Date(dueDate);
    }

    if (dueDateFrom || dueDateTo) {
      filter.dueDate = filter.dueDate || {};
      if (dueDateFrom) filter.dueDate.$gte = new Date(dueDateFrom);
      if (dueDateTo) filter.dueDate.$lte = new Date(dueDateTo);
    }

    const tasks =
      await Task.find(filter)

        .populate(
          "assignedTo",
          "email"
        )
        .populate("createdBy", "email name")

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

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const populatedTask = await Task.findById(req.params.id)
      .populate("assignedTo", "email name")
      .populate("createdBy", "email name");

    res.json(populatedTask);

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

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (req.files?.length) {
      task.documents = task.documents.concat(req.files.map((file) => file.filename)).slice(0, 3);
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    if (req.user.role === "admin" && req.body.assignedTo) {
      task.assignedTo = req.body.assignedTo;
    }
    await task.save();
    const updatedTask = await Task.findById(req.params.id)
      .populate("assignedTo", "email name")
      .populate("createdBy", "email name");

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

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Task.findByIdAndDelete(req.params.id);

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