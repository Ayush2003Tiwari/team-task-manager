const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ---------------- MODELS ----------------

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const projectSchema = mongoose.Schema({
  name: String,
  description: String,
});

const Project = mongoose.model("Project", projectSchema);

const taskSchema = mongoose.Schema({
  title: String,
  description: String,
  dueDate: String,
  status: {
    type: String,
    default: "Pending",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
});

const Task = mongoose.model("Task", taskSchema);

// ---------------- AUTH ----------------

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Register Failed",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
      password,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: "sampletoken",
    });
  } catch (error) {
    console.log(error);
  }
});

// ---------------- PROJECTS ----------------

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find();

    res.json(projects);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/projects", async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
    });

    res.json(project);
  } catch (error) {
    console.log(error);
  }
});

// ---------------- TASKS ----------------

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().populate(
      "project"
    );

    res.json(tasks);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      project,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      project,
    });

    res.json(task);
  } catch (error) {
    console.log(error);
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      task.status = req.body.status;

      await task.save();

      res.json(task);
    }
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task Deleted",
    });
  } catch (error) {
    console.log(error);
  }
});

// ---------------- ROOT ----------------

app.get("/", (req, res) => {
  res.send("API Running");
});

// ---------------- SERVER ----------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});