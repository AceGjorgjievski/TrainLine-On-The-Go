import { useResponsive } from "@/hooks";
import {
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

type Props = {
  direction: "departure" | "arrival" | "all" | "";
  handleDirectionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  includeAllOption?: boolean;
};

export default function DirectionSelector({
  direction,
  handleDirectionChange,
  includeAllOption = false
}: Props) {
  const tDirectionSelector = useTranslations("Direction-Selector");

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 2,
        bgcolor: "#fffdfdff",
        borderRadius: 2,
        padding: 3,
        boxShadow: 10,
        width: {
          md: '600px',
          sm: '300px',
          xs: '250px'
        },
        border: '2px solid'
      }}
    >
      <Typography sx={{ fontWeight: "bold", mb: 1 }}>
        {tDirectionSelector("title-form")}
      </Typography>
      <Container sx={{
        width: 'fit-content',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <RadioGroup
        row
        aria-labelledby="direction-radio-group"
        name="direction"
        value={direction}
        onChange={handleDirectionChange}
      >
        <FormControlLabel
          value="departure"
          control={<Radio />}
          label={tDirectionSelector("radio-option-one")}
        />
        <FormControlLabel
          value="arrival"
          control={<Radio />}
          label={tDirectionSelector("radio-option-two")}
        />
        {includeAllOption && (
          <FormControlLabel
            value="all"
            control={<Radio />}
            label={tDirectionSelector("admin-option")}
          />
        )}
      </RadioGroup>
      </Container>

    </Container>
  );
}
