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
 * This component displays the requirements in an accordion format using Material-UI components .
*/

import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ReferenceAccordion({ requirements }) {
  if (!requirements) return null; // nothing to render until data exists

  const entities = requirements.Entities || [];
  const roles = requirements.Roles || [];
  const features = requirements.Features || [];

  return (
    <div>
      {/* App Name */}
      <Accordion >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
          minHeight: "32px !important",   // reduce overall height
          "& .MuiAccordionSummary-content": {
            margin: 0,                    // remove extra margin
          },
          "& .MuiTypography-root": {
            padding: 0,                   // remove Typography padding
          },
        }}>
          <Typography component="span">App Name</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          <Typography align='left' style={{ margin: 0, paddingLeft: "20px" }}>
            {requirements["App Name"] || "N/A"}</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Entities */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}
          sx={{
            minHeight: "32px !important",   // reduce overall height
            "& .MuiAccordionSummary-content": {
              margin: 0,                    // remove extra margin
            },
            "& .MuiTypography-root": {
              padding: 0,                   // remove Typography padding
            },
          }}>
          <Typography component="span">Entities</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          <ul align="left" style={{ margin: 0, paddingLeft: "20px" }}>
            {entities.map((entity) => (
              <li key={entity}>{entity}</li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>

      {/* Roles */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
          minHeight: "32px !important",   // reduce overall height
          "& .MuiAccordionSummary-content": {
            margin: 0,                    // remove extra margin
          },
          "& .MuiTypography-root": {
            padding: 0,                   // remove Typography padding
          },
        }}>
          <Typography component="span">Roles</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          <ul align="left" style={{ margin: 0, paddingLeft: "20px" }}>
            {roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>

      {/* Features */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
          minHeight: "32px !important",   // reduce overall height
          "& .MuiAccordionSummary-content": {
            margin: 0,                    // remove extra margin
          },
          "& .MuiTypography-root": {
            padding: 0,                   // remove Typography padding
          },
        }}>
          <Typography component="span">Features</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          <ul align="left" style={{ margin: 0, paddingLeft: "20px" }}>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
