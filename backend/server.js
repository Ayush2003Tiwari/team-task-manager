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
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });

// Test Route
app.get("/", (req, res) => {
  res.send("API Running");
});

// Auth Routes
app.post("/api/auth/register", (req, res) => {
  res.json({
    success: true,
    message: "Register Route Working",
  });
});

app.post("/api/auth/login", (req, res) => {
  res.json({
    success: true,
    message: "Login Route Working",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});