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
import { useTranslations } from "next-intl";

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
  const tSideDrawerRoute = useTranslations("Side-Drawer.question.route");

  return (
    <>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="route-select-label">
          {tSideDrawerRoute("name")}
        </InputLabel>
        <Select
          labelId="route-select-label"
          id="route-select"
          value={route}
          label={tSideDrawerRoute("name")}
          onChange={handleRouteChange}
        >
          {Object.entries(renderRoutes).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {tSideDrawerRoute(
                "routes." +
                  value.toLowerCase().replace(/\s+/g, "").replace("-", "-")
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
