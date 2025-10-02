import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema({
  userInput: String,
  appName: String,
  entities: [String],
  roles: [String],
  features: [String],
  createdAt: { type: Date, default: Date.now },
});

const Requirement = mongoose.model("Requirement", requirementSchema);

export default Requirement;