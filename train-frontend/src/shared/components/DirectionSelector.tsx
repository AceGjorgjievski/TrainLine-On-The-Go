import {
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

type Props = {
  direction: "departure" | "arrival" | "";
  handleDirectionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function DirectionSelector({
  direction,
  handleDirectionChange,
}: Props) {
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
        width: "fit-content",
        border: '2px solid'
      }}
    >
      <Typography sx={{ fontWeight: "bold", mb: 1 }}>
        Choose direction
      </Typography>
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
          label="Departure from Skopje"
        />
        <FormControlLabel
          value="arrival"
          control={<Radio />}
          label="Arrival to Skopje"
        />
      </RadioGroup>
    </Container>
  );
}
