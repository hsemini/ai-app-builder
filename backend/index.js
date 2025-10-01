// ---------- Imports ----------
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

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

// ---------- Schema ----------
const requirementSchema = new mongoose.Schema({
  userInput: String,
  appName: String,
  entities: [String],
  roles: [String],
  features: [String],
  createdAt: { type: Date, default: Date.now }
});
const Requirement = mongoose.model("Requirement", requirementSchema);

// ---------- AI Extraction Function ----------

/* function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/); // find first {...} block
  return match ? match[0] : null;
}

function validateRequirements(obj) {
  if (!obj) return false;
  return (
    typeof obj["App Name"] === "string" &&
    Array.isArray(obj.Entities) &&
    Array.isArray(obj.Roles) &&
    Array.isArray(obj.Features)
  );
}
 */

function normalizeArray(field) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") return field.split(",").map(s => s.trim());
  return [];
}

function validateRequirements(obj) {
  if (!obj) return false;
  obj.Entities = normalizeArray(obj.Entities);
  obj.Roles = normalizeArray(obj.Roles);
  obj.Features = normalizeArray(obj.Features);
  return typeof obj["App Name"] === "string";
}

async function extractRequirements(description) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an assistant that extracts structured app requirements from natural language.
Always return ONLY valid JSON with this structure:
{
  "App Name": "...",
  "Entities": ["..."],
  "Roles": ["..."],
  "Features": ["..."]
}

Guidelines:
- Entities = the core data objects that the system must store in the database. 
  * Include only nouns that correspond to data tables. 
  * Exclude derived concepts like reports, analytics, dashboards, or summaries. 
  * Always use singular, capitalized form(e.g., Student, Course, Grade). 
  * Return Entities in the same order as they appear in the description. 
  * If uncertain whether something is an Entity or a derived concept, exclude it. 
  * Prefer fewer but accurate Entities.
- Roles = actors (humans or systems) that interact with the app.
- Features = actions the system should support, always in “verb + noun” form.
- Do not explain, just return JSON.`
      },
      {
        role: "user",
        content: `Description: "${description}"`
      }
    ],
    temperature: 0
  });

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch (err) {
    console.error("Failed to parse AI response:", err);
    return null;
  }

/* try {
    let rawText = response.choices[0].message.content;
    let jsonText = extractJson(rawText);
    let data = JSON.parse(jsonText);

    if (!validateRequirements(data)) {
      throw new Error("Invalid structure");
    }

    // cleanup entities
    data.Entities = cleanEntities(data.Entities);

    return data;
  } catch (err) {
    console.error("AI response invalid:", err);
    return {
      "App Name": "Unknown",
      "Entities": [],
      "Roles": [],
      "Features": []
    }; // fallback safe object
  } */

}

// ---------- Express Route ----------
app.post("/api/parse", async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: "Description is required" });

  try {
    const requirements = await extractRequirements(description);

    console.log("Extracted Requirements:", requirements);

    if (!requirements) {
      return res.status(500).json({ error: "AI failed to extract requirements" });
    }

    // Save to MongoDB
    const reqDoc = new Requirement({
      userInput: description,
      appName: requirements["App Name"] || "Unknown",
      entities: requirements.Entities || [],
      roles: requirements.Roles || [],
      features: requirements.Features || []
    });
    await reqDoc.save();
    console.log("Saved requirement:", reqDoc);

    res.json(requirements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ---------- Start Server ----------
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
