const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

let tasks = [];

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token !== "token123") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

app.post("/tasks", verifyToken, (req, res) => {
  const task = req.body;
  tasks.push(task);
  console.log(tasks);
  res.json({ message: "Task created", task });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.put("/tasks/:id", verifyToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const { isCompleted } = req.body;
  const task = tasks.find((t) => t.id === taskId);

  if (task) {
    task.isCompleted = isCompleted;
    console.log(tasks);
    res.json({ message: "Task updated", task });
  } else {
    res.json({ message: "Task not found" });
  }
});

app.delete("/tasks/:id", verifyToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((t) => t.id !== taskId);
  console.log(tasks);
  res.json({ message: "Task deleted" });
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});