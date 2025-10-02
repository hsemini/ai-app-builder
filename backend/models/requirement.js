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
 * This file defines the Mongoose schema and model for storing user requirements.
 * It includes fields for user input, app name, entities, roles, features, and timestamps.
 * The model is exported for use in other parts of the application.
 */

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