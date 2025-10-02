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
 * The main application component that integrates all parts of the AI App Builder.
 * It includes a text area for user input, a button to trigger app generation,
 * and displays the generated app's metadata and UI based on backend responses.
 */

import React, { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid, Container } from "@mui/material";
import "./App.css";
import ReferenceAccordion from "./components/Accordion";
import BasicButton from "./components/BasicButton";
import BasicTextArea from "./components/BasicTextArea";
import DynamicTabs from "./components/Tab";

function App() {
  const [description, setDescription] = useState("");   // textarea text
  const [responseData, setResponseData] = useState(null); // holds unified backend response

  // Triggered when button is clicked
  const handleGenerate = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description })
      });
      const data = await response.json();
      setResponseData(data);   // save entire response (includes requirements + mapping)
    } catch (err) {
      console.error("Error generating app:", err);
    }
  };

  return (
    <Grid container sx={{
      minHeight: "100vh",
      width: "100%",
      margin: 0,
      padding: 0,
    }}>
      {/* Left side - App Builder */}
      <Grid item paddingBottom={10} sx={{
        width: "35%",
        backgroundColor: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        borderRight: "2px solid #e0e0e0",
        flexGrow: 1,
        "&:hover": {
          backgroundColor: "#ffffff",
          boxShadow: 3,
          borderRight: "2px solid #e0e0e0",
          zIndex: 1
        },
      }}>
        <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center", p: 0 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              p: 1,
              display: 'flex-start',
              alignItems: 'center',
              height: '64px',
              fontFamily: 'Inter, Roboto, Arial, sans-serif',
              flexGrow: 1,
            }}
          >
            AI App Builder
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Describe Your App Idea Below
          </Typography>

          <BasicTextArea
            label="Describe Your App Idea..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <BasicButton label="Generate App" onClick={handleGenerate} />
          </Box>



          {!responseData ? (
            <Typography />
          ) : (
            <Typography variant="h6" style={{ margin: 0, paddingBottom: "0" }}
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                height: '60px',
                fontFamily: 'Inter, Roboto, Arial, sans-serif',
              }}>
              AI Generated App Meta Data
            </Typography>
          )}

          {responseData && (
            <Box sx={{ mt: 3 }}>
              <ReferenceAccordion requirements={responseData} />
            </Box>
          )}

        </Container>
      </Grid>

      {/* Right side - Generated UI */}
      <Grid item sx={{ p: 1, height: "100vh", width: "65%", backgroundColor: "#fafafa" }}>
        {!responseData ? (
          <Typography variant="h6" color="textSecondary" sx={{
            p: 1,
            height: "100vh",
            width: "65%",
            backgroundColor: "#fafafa",
            display: "flex",                // make it flex
            flexDirection: "column",        // stack children vertically
            justifyContent: "center",       // center vertically
            alignItems: "center",           // center horizontally
          }}>
            Your UI will load here...
          </Typography>
        ) : (
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <DynamicTabs roles={responseData.Roles} mapping={responseData.Mapping} />
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

export default App;
