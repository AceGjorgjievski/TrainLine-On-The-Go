import { Direction } from "@/types/submit.types";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

type Props = {
  direction: Direction | "" | undefined;
  handleDirectionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function DepartureArrivalFormControl({
  direction,
  handleDirectionChange,
}: Props) {

  const tSideDrawerDirection = useTranslations("Side-Drawer.question.direction");

  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {tSideDrawerDirection("name")}
      </Typography>
      <RadioGroup value={direction} onChange={handleDirectionChange}>
        <FormControlLabel
          value="departure"
          control={<Radio />}
          label={tSideDrawerDirection("radio-option-one")}
        />
        <FormControlLabel
          value="arrival"
          control={<Radio />}
          label={tSideDrawerDirection("radio-option-two")}
        />
      </RadioGroup>
    </FormControl>
  );
}
