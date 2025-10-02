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
 * A tab component using Material-UI adapted to the application UI requirements.
 */

import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";

// --- helpers for search bar ---
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

// --- custom tab panel ---
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// --- main component ---
export default function DynamicTabs({ appName, roles = [], mapping = {} }) {
  const [value, setValue] = React.useState(0);
  const [formData, setFormData] = React.useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (role, field, val) => {
    setFormData((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: val,
      },
    }));
  };

  const handleSubmit = (role) => {
    console.log("Form submitted for role:", role, formData[role]);
    alert(`Form submitted for ${role}!`);
  };

  const handleClose = (role) => {
    setFormData((prev) => ({
      ...prev,
      [role]: {},
    }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* ✅ App Bar on top */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            {"Tab Application Form Group" }
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <br></br>

<Typography
           variant="h6" style={{ margin: 0, paddingBottom: "0" }}
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              height: '60px',
              fontFamily: 'Inter, Roboto, Arial, sans-serif',
            }}>
            {"Course Management System"|| "Tab Application Form Group" }
          </Typography>

      {/* ✅ Tabs under AppBar */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="dynamic tabs">
          {roles.map((role, index) => (
            <Tab key={role} label={role} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>

      {/* ✅ Tab panels with forms */}
      {roles.map((role, index) => (
        <CustomTabPanel key={role} value={value} index={index}>
          {mapping[role] && (
            <Box>
              <Typography variant="h6" align="left" style={{ margin: 0, paddingBottom: "0" }}
            sx={{
              color: 'black',
              p: 0,
              display: 'flex',
              alignItems: 'center',
              height: '60px',
              fontFamily: 'Inter, Roboto, Arial, sans-serif',
            }}>
                Form: {mapping[role].feature}
              </Typography>
              {mapping[role].fields.map((field, i) => (
                <Box
                  key={field}
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Typography variant="subtitle1" sx={{ width: "200px" }}>
                    {i + 1}. {field}:
                  </Typography>
                  <TextField
                    size="small"
                    variant="outlined"
                    value={formData[role]?.[field] || ""}
                    onChange={(e) =>
                      handleInputChange(role, field, e.target.value)
                    }
                    sx={{ flex: 1 }}
                  />
                </Box>
              ))}
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button variant="outlined" onClick={() => handleClose(role)}>
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSubmit(role)}
                >
                  Submit
                </Button>
              </Stack>
            </Box>
          )}
        </CustomTabPanel>
      ))}
    </Box>
  );
}
