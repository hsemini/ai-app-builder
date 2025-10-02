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
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component="span">App Name</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography align='left'>{requirements["App Name"] || "N/A"}</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Entities */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component="span">Entities</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul align ="left">
            {entities.map((entity) => (
              <li key={entity}>{entity}</li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>

      {/* Roles */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component="span">Roles</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul align="left">
            {roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>

      {/* Features */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component="span">Features</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul align="left">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
