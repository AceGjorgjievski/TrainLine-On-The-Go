import { Direction } from "@/types/submit.types";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

type Props = {
  direction: Direction | "" | undefined;
  handleDirectionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function DepartureArrivalFormControl({
  direction,
  handleDirectionChange,
}: Props) {
  return (
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
  );
}
