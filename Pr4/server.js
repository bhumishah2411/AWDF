const express = require("express");
const app = express();

app.use(express.json());

// ---------------------
// In-memory database
// ---------------------

let tasks = [
  { id: 1, title: "Study React" },
  { id: 2, title: "Complete Practical" }
];

// ---------------------
// Logging Middleware
// ---------------------

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toLocaleString()}`);
  next();
});

// ---------------------
// Content-Type Middleware
// ---------------------

app.use((req, res, next) => {

  if (
    (req.method === "POST" || req.method === "PUT") &&
    !req.is("application/json")
  ) {
    return res.status(400).json({
      message: "Content-Type must be application/json"
    });
  }

  next();

});

// ---------------------
// ID Validation Middleware
// ---------------------

function validateId(req, res, next) {

  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      message: "Invalid Task ID"
    });
  }

  next();

}

// ---------------------
// GET All Tasks
// ---------------------

app.get("/tasks", (req, res) => {

  res.status(200).json(tasks);

});

// ---------------------
// POST Task
// ---------------------

app.post("/tasks", (req, res) => {

  const newTask = {
    id: tasks.length + 1,
    title: req.body.title
  };

  tasks.push(newTask);

  res.status(201).json(newTask);

});

// ---------------------
// PUT Task
// ---------------------

app.put("/tasks/:id", validateId, (req, res) => {

  const id = Number(req.params.id);

  const task = tasks.find(t => t.id === id);

  if (!task) {

    return res.status(404).json({
      message: "Task not found"
    });

  }

  task.title = req.body.title;

  res.status(200).json(task);

});

// ---------------------
// DELETE Task
// ---------------------

app.delete("/tasks/:id", validateId, (req, res) => {

  const id = Number(req.params.id);

  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {

    return res.status(404).json({
      message: "Task not found"
    });

  }

  tasks.splice(index, 1);

  res.status(200).json({
    message: "Task deleted"
  });

});

// ---------------------
// 404 Middleware
// ---------------------

app.use((req, res) => {

  res.status(404).json({
    message: "Route Not Found"
  });

});

// ---------------------
// Global Error Handler
// ---------------------

app.use((err, req, res, next) => {

  console.log(err.stack);

  res.status(500).json({
    message: "Something went wrong"
  });

});

// ---------------------

app.listen(5000, () => {

  console.log("Server running on port 5000");

});