import { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { TrainRouteDTO } from "@/types";
import { getArrivalTrainRoutes, getDepartureTrainRoutes } from "@/services";

type Props = {
  route: string | "";
  direction: "departure" | "arrival" | "";
  handleRouteChange: (event: SelectChangeEvent) => void;
};

export default function RouteDirectionFormControl({
  route,
  direction,
  handleRouteChange,
}: Props) {
  const [routes, setRoutes] = useState<TrainRouteDTO[]>([]);
  const tSideDrawerRoute = useTranslations("Side-Drawer.question.route");

  useEffect(() => {
    if (!direction) return;

    const fetchRoutes = async () => {
      try {
        const data =
          direction === "departure"
            ? await getDepartureTrainRoutes()
            : await getArrivalTrainRoutes();

        setRoutes(data);
      } catch (err) {
        console.error("Failed to fetch routes", err);
      }
    };

    fetchRoutes();
  }, [direction]);


  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel id="route-select-label">{tSideDrawerRoute("name")}</InputLabel>
      <Select
        labelId="route-select-label"
        id="route-select"
        value={route}
        label={tSideDrawerRoute("name")}
        onChange={handleRouteChange}
      >
        {routes.map((r) => {
  // Normalize to translation key format: "skopje-tabanovce"
  const normalizedKey = r.name
    .toLowerCase()
    .trim()
    .replace(/\s*-\s*/g, "-") // remove spaces around hyphen
    .replace(/\s+/g, ""); // remove remaining spaces

  return (
    <MenuItem key={r.id} value={r.name}>
      {tSideDrawerRoute(`routes.${normalizedKey}`)}
    </MenuItem>
  );
})}
      </Select>
    </FormControl>
  );
}
