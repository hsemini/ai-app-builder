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

/**
 * Backend server using Express, MongoDB, and OpenAI to extract app requirements from user descriptions.
 * It saves the requirements to MongoDB and provides endpoints to retrieve them.
 * The AI extraction combines requirements and role-entity-feature-field mapping in a single prompt
 * to ensure consistency and reduce errors.
 * The extracted mapping is cleaned to remove duplicates before being sent to the frontend.
 */

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import requirementRoutes from "./routes/requirements.js";
import Requirement from "./models/requirement.js";

dotenv.config();

// ---------- OpenAI Client ----------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ---------- Express Setup ----------
const app = express();
app.use(cors());
app.use(express.json());

// ---------- MongoDB Setup ----------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// ---------- Unified AI Extraction ----------
function cleanMapping(mapping) {
  const cleaned = {};
  for (const [role, details] of Object.entries(mapping)) {
    cleaned[role] = {
      entity: details.entity,
      feature: details.feature,
      fields: [...new Set(details.fields)] // remove duplicates
    };
  }
  return cleaned;
}

async function extractRequirementsAndMapping(description) {
  const unifiedPrompt = `
You are an assistant that extracts structured app requirements AND maps roles to entities, features, and fields.
Always return ONLY valid JSON with this structure:

{
  "App Name": "...",
  "Entities": ["..."],
  "Roles": ["..."],
  "Features": ["..."],
  "Mapping": {
    "RoleName": {
      "entity": "Entity1",
      "feature": "Feature1",
      "fields": ["Field1", "Field2", "Field3"]
    }
  }
}

Guidelines:
- App Name:
  * Choose a short descriptive title based on the description, and always append the word "System".
  * Example: "Course Management System", "Library Tracking System".
- Entities:
  * Core data objects that must be stored in the database.
  * Include only nouns that correspond to data tables.
  * Exclude derived concepts like reports, dashboards, analytics.
  * Always use singular, capitalized form (e.g., Student, Course, Grade).
  * Return entities in the same order as they appear in the description.
  * Prefer fewer but accurate entities.
- Roles:
  * Human/system actors that interact with the app.
- Features:
  * System actions in verb + noun form (e.g., "Add course", "Enroll student").
- Mapping:
  * Each role must appear exactly once in the JSON.
  * Each role must map to exactly ONE entity, ONE feature, and ONE list of fields.
  * Do not duplicate fields, features, or entities inside a role.
  * Do not repeat roles multiple times.
  * Fields must always be a clean array (no nesting, no repetition).
  * If the role is "Admin", limit its entity to managing existing entities (e.g., Student, Course, Grade).
  * Ensure Admin has only ONE feature (e.g., "Manage reports") and fields must only be reused IDs or attributes already defined.
  * Each role must map to exactly ONE entity, ONE feature, and ONE list of fields.
  * Fields should represent practical DB columns.
  * Each entity includes one identifier (e.g., Student → StudentID).
  * Do NOT generate meaningless IDs (e.g., GradeID, ReportID).
  * Prefer mapping a role to its own entity if available (Student ↔ Student).
  * Features must align with the role’s action from the description.
  * Fields must belong only to that entity (no cross-role mixups).
  * Do not duplicate or repeat roles/entities/features.
  * If the entity is a link table (like Grade), use composite keys (StudentID + CourseID).
  * Example fields:
    - Student: [StudentID, Name, Email, Age]
    - Course: [CourseID, Title, Code, Credits]
    - Grade: [StudentID, CourseID, Score]

Description: "${description}"
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: unifiedPrompt }],
    temperature: 0
  });

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch (err) {
    console.error("Failed to parse AI response:", err);
    return null;
  }
}

// ---------- POST: Extract & Save ----------
app.post("/api/parse", async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: "Description is required" });

  try {
    const result = await extractRequirementsAndMapping(description);
    if (!result) return res.status(500).json({ error: "AI failed to extract requirements" });

    // Save only the requirement part to MongoDB
    const reqDoc = new Requirement({
      userInput: description,
      appName: result["App Name"] || "Unknown",
      entities: result.Entities || [],
      roles: result.Roles || [],
      features: result.Features || []
    });
    await reqDoc.save();
    console.log("Saved requirement:", reqDoc);

    // Debug log mapping
    const clean = cleanMapping(result.Mapping);
    console.log("Clean Mapping:", JSON.stringify(clean, null, 2));
    result.Mapping = clean; // 

    // Send full response (requirements + mapping) to frontend
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ---------- Routes ----------
app.use("/api/requirements", requirementRoutes);

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
