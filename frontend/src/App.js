import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import "./App.css";
import bgImage from "./assets/background.jpg";
//import Background from "./components/background";
//import Button from "./components/button"; 
// test

function App() {
  
  const [description, setDescription] = useState("");   //to hold textarea text
  const [response, setResponse] = useState(null);      // to hold backend response

  // Triggered when button is clicked
  const handleGenerate = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }) // send description to backend
      });

      const data = await res.json();
      setResponse(data);   // display backend response
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    
   <Box
      sx={{
        minHeight: "100vh",
       backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
   <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
      {/* Title */}
      <Typography variant="h3" gutterBottom>
        AI App Builder
      </Typography>

      {/* Subtitle */}
      <Typography variant="subtitle1" gutterBottom>
        Describe your app idea below
      </Typography>

      {/* Textarea */}
      <TextField
        multiline
        rows={7}
        fullWidth
        placeholder="Describe your app idea..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{
          mb: 3,
          backgroundColor: "white",     // white background
          borderRadius: 1,               // optional: rounded corners
          "& .MuiInputBase-root": {
            backgroundColor: "white",    // ensure inner input area is white
          }
     }}
      />

      {/* Button */}
      <Box>
        {/* <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGenerate}
        > */}
        <Button
          variant="contained"
          size="large"
          onClick={handleGenerate}
          sx={{
            backgroundColor: "white",   // white button
            color: "black",             // black text
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#f0f0f0", // light gray on hover
              fontWeight: "bold",
            }
          }}
        >
          Generate App
        </Button>
      </Box>
      {response && (
            <div className="response">
              <p>Generated App Details:</p>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
      )}
    </Container>
    </Box>
  );
}

export default App;