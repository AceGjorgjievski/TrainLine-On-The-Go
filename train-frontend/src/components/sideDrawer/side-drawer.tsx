import {
  Button,
  Drawer,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

type Props = {
  drawerOpen: boolean;
  toggleDrawer: (action: boolean) => void;
};

export default function SideDrawer({ drawerOpen, toggleDrawer }: Props) {
  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => toggleDrawer(false)}
      sx={{
        "& .MuiDrawer-paper": {
          height: "50%",
          top: "10%",
        },
      }}
    >
      <Box sx={{ width: 300, padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Choose options
        </Typography>
        <FormControl>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Please select whether you&apos;re departing from or arriving in
            Skopje.
          </Typography>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue="Departure from Skopje"
          >
            <FormControlLabel
              value="Departure from Skopje"
              control={<Radio />}
              label={
                <Typography variant="body2" color="primary">
                  Departure from Skopje
                </Typography>
              }
            />
            <FormControlLabel
              value="Arrival in Skopje"
              control={<Radio />}
              label={
                <Typography variant="body2" color="primary">
                  Arrival in Skopje
                </Typography>
              }
            />
          </RadioGroup>
        </FormControl>
        <Button variant="outlined" onClick={() => toggleDrawer(false)}>
          Close
        </Button>
      </Box>
    </Drawer>
  );
}
