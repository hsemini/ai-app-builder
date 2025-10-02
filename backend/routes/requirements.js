import express from "express";
import Requirement from "../models/requirement.js";

const router = express.Router();

// GET latest requirement
router.get("/latest", async (req, res) => {
  try {
    const latest = await Requirement.findOne().sort({ createdAt: -1 });
    if (!latest) return res.status(404).json({ error: "No requirements found" });
    res.json(latest);
  } catch (err) {
    console.error("Error fetching latest requirement:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all requirements
router.get("/", async (req, res) => {
  try {
    const all = await Requirement.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    console.error("Error fetching all requirements:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
