const express = require("express");

const router = express.Router();

const {
  createProject,
  getProjects,
} = require("../controllers/projectController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, createProject);

router.get("/", protect, getProjects);

module.exports = router;