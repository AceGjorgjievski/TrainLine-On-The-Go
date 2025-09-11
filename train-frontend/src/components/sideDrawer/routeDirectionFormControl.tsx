
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import {
  fromSkopjeRouteNameMap,
  toSkopjeRouteNameMap,
} from "@/constants/routes";
import { Direction, RouteKey } from "@/types";

type Props = {
  route: RouteKey | "" | undefined;
  direction: Direction | "";
  handleRouteChange: (event: SelectChangeEvent) => void;
};

export default function RouteDirectionFormControl({
  route,
  direction,
  handleRouteChange,
}: Props) {
  const renderRoutes =
    direction === "departure" ? fromSkopjeRouteNameMap : toSkopjeRouteNameMap;

  return (
    <>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="route-select-label">Choose Train Route</InputLabel>
        <Select
          labelId="route-select-label"
          id="route-select"
          value={route}
          label="Choose Train Route"
          onChange={handleRouteChange}
        >
          {Object.entries(renderRoutes).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
