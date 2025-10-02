/*
 * Copyright 2025 Hasara Semini
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
