import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function BasicTextArea({ label, value, onChange }) {
  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '40ch' } }}
      noValidate
      autoComplete="off"
    >
      <TextField
        multiline
        rows={5}
        id="outlined-basic"
        label={label}
        variant="outlined"
        value={value}
        onChange={onChange}
      />
    </Box>
  );
}
