'use client';

import {
  Button,
  Drawer,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
} from '@mui/material';
import { useState } from 'react';

type Props = {
  drawerOpen: boolean;
  toggleDrawer: (action: boolean) => void;
};

export default function SideDrawer({ drawerOpen, toggleDrawer }: Props) {
  const [direction, setDirection] = useState('');
  const [route, setRoute] = useState('');
  const [viewOption, setViewOption] = useState('');

  const handleRouteChange = (event: SelectChangeEvent) => {
    setRoute(event.target.value);
  };

  const handleDirectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDirection(event.target.value);
    setRoute('');
    setViewOption('');
  };

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => toggleDrawer(false)}
      sx={{
        '& .MuiDrawer-paper': {
          height: '70%',
          top: '11.4%',
        },
      }}
    >
      <Box sx={{ width: 300, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Choose Options
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Are you departing from or arriving in Skopje?
          </Typography>
          <RadioGroup value={direction} onChange={handleDirectionChange}>
            <FormControlLabel
              value="departure"
              control={<Radio />}
              label="Departure from Skopje"
            />
            <FormControlLabel
              value="arrival"
              control={<Radio />}
              label="Arrival in Skopje"
            />
          </RadioGroup>
        </FormControl>

        {direction && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="route-select-label">Choose Train Route</InputLabel>
            <Select
              labelId="route-select-label"
              id="route-select"
              value={route}
              label="Choose Train Route"
              onChange={handleRouteChange}
            >
              <MenuItem value="tabanovce">Skopje – Tabanovce</MenuItem>
              <MenuItem value="veles">Skopje – Veles</MenuItem>
              <MenuItem value="gevgelija">Skopje – Gevgelija</MenuItem>
              <MenuItem value="bitola">Skopje – Bitola</MenuItem>
              <MenuItem value="kochani">Skopje – Kochani</MenuItem>
              <MenuItem value="kichevo">Skopje – Kichevo</MenuItem>
            </Select>
          </FormControl>
        )}

        {route && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              What would you like to view?
            </Typography>
            <RadioGroup
              value={viewOption}
              onChange={(e) => setViewOption(e.target.value)}
            >
              <FormControlLabel
                value="stations"
                control={<Radio />}
                label="Station Map Points"
              />
              <FormControlLabel
                value="live"
                control={<Radio />}
                label="Train Live Tracking"
              />
            </RadioGroup>
          </FormControl>
        )}

        <Button variant="outlined" fullWidth onClick={() => toggleDrawer(false)}>
          Submit
        </Button>
      </Box>
    </Drawer>
  );
}
