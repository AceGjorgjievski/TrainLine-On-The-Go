import { ViewOptions } from "@/types";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

type Props = {
  viewOption: ViewOptions | "" | undefined;
  handleStationLiveTypeChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

export default function StationLiveTypeFormControl({
  viewOption,
  handleStationLiveTypeChange,
}: Props) {
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        What would you like to view?
      </Typography>
      <RadioGroup value={viewOption} onChange={handleStationLiveTypeChange}>
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
  );
}
