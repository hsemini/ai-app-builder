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
 * A basic button component using Material-UI adapted to the application UI requirements.
 */

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function BasicButton({ label, onClick }) {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="contained" onClick={onClick}>
        {label}
      </Button>
    </Stack>
  );
}