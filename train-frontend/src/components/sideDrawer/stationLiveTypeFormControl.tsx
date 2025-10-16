import { ViewOptions } from "@/types";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

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
    const tSideDrawerMode = useTranslations("Side-Drawer.question.mode");
  
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {tSideDrawerMode("name")}
      </Typography>
      <RadioGroup value={viewOption} onChange={handleStationLiveTypeChange}>
        <FormControlLabel
          value="stations"
          control={<Radio />}
          label={tSideDrawerMode("radio-option-one")}
        />
        <FormControlLabel
          value="live"
          control={<Radio />}
          label={tSideDrawerMode("radio-option-two")}
        />
      </RadioGroup>
    </FormControl>
  );
}
